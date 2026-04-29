import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { ensureSeedData } from "../../lib/seed";

export async function GET(request) {
  await ensureSeedData();
  const userId = new URL(request.url).searchParams.get("userId");
  const badges = await prisma.badge.findMany({ orderBy: { createdAt: "asc" } });
  const earned = userId
    ? await prisma.userBadge.findMany({ where: { userId }, include: { badge: true } })
    : [];
  const earnedMap = new Map(earned.map((item) => [item.badgeId, item]));
  return NextResponse.json({
    badges: badges.map((badge) => ({
      ...badge,
      locked: !earnedMap.has(badge.id),
      earned: earnedMap.has(badge.id) ? "Earned" : "Locked",
    })),
  });
}
