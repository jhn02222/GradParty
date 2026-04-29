import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { feedShape, rankedUsers } from "../../lib/game";
import { ensureSeedData } from "../../lib/seed";

export async function GET() {
  await ensureSeedData();
  const users = await rankedUsers(10);
  const [totalPlayers, totalDrinks, totalQuests, feed, gallery] = await Promise.all([
    prisma.user.count(),
    prisma.user.aggregate({ _sum: { drinks: true } }),
    prisma.submission.count({ where: { status: "APPROVED" } }),
    prisma.feedItem.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: true } }),
    prisma.submission.findMany({
      where: { status: "APPROVED" },
      orderBy: { reviewedAt: "desc" },
      take: 3,
      include: { user: true, quest: true },
    }),
  ]);

  return NextResponse.json({
    users,
    totals: {
      players: totalPlayers,
      drinks: totalDrinks._sum.drinks || 0,
      quests: totalQuests,
    },
    feed: feed.map(feedShape),
    gallery: gallery.map((item) => ({
      id: item.id,
      user: item.user.name,
      quest: item.quest.title,
      points: item.points,
      photoUrl: item.photoUrl,
      color: "from-red-700 to-zinc-950",
    })),
  });
}
