import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { feedShape, rankedUsers } from "../../lib/game";
import { ensureSeedData } from "../../lib/seed";
import { requireAdmin } from "../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  await ensureSeedData();
  const users = await rankedUsers(100);
  const [totalPlayers, totalDrinks, totalProofs, feed, gallery, drinkTypeCounts] = await Promise.all([
    prisma.user.count(),
    prisma.user.aggregate({ _sum: { drinks: true } }),
    prisma.submission.count({ where: { status: "APPROVED" } }),
    prisma.feedItem.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: true } }),
    prisma.submission.findMany({
      where: { status: "APPROVED" },
      orderBy: { reviewedAt: "desc" },
      take: 60,
      include: { user: true, quest: true },
    }),
    prisma.submission.groupBy({
      by: ["userId", "drinkType"],
      where: {
        status: "APPROVED",
        drinkType: { not: null },
      },
      _sum: { drinks: true },
    }),
  ]);
  const drinkCountsByUser = drinkTypeCounts.reduce((acc, item) => {
    if (!item.userId || !item.drinkType) return acc;
    acc[item.userId] ||= {};
    acc[item.userId][item.drinkType] = item._sum.drinks || 0;
    return acc;
  }, {});

  return NextResponse.json({
    users: users.map((user) => ({
      ...user,
      drinkCounts: drinkCountsByUser[user.id] || {},
    })),
    totals: {
      players: totalPlayers,
      drinks: totalDrinks._sum.drinks || 0,
      proofs: totalProofs,
    },
    feed: feed.map(feedShape),
    gallery: gallery.map((item) => ({
      id: item.id,
      user: item.user.name,
      label: item.drinks ? "Drink proof" : "Party proof",
      points: item.points,
      drinks: item.drinks,
      photoUrl: item.photoUrl,
      createdAt: item.reviewedAt || item.createdAt,
      color: "from-red-700 to-zinc-950",
    })),
  }, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
