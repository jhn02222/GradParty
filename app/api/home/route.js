import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { feedShape, rankedUsers, userShape } from "../../lib/game";
import { ensureSeedData } from "../../lib/seed";

export async function GET(request) {
  await ensureSeedData();
  const userId = new URL(request.url).searchParams.get("userId");
  const leaders = await rankedUsers(100);
  const fallback = leaders[0];
  const dbUser = userId
    ? await prisma.user.findUnique({ where: { id: userId }, include: { _count: { select: { badges: true } } } })
    : null;
  const rank = dbUser ? leaders.find((user) => user.id === dbUser.id)?.rank || leaders.length : fallback?.rank;
  const user = dbUser ? userShape(dbUser, rank) : fallback;
  const feed = await prisma.feedItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true },
  });
  const approved = user?.id
    ? await prisma.submission.count({ where: { userId: user.id, status: "APPROVED" } })
    : 0;

  return NextResponse.json({
    user,
    stats: {
      drinks: user?.drinks || 0,
      points: user?.points || 0,
      rank: user?.rank ? `${user.rank}${ordinal(user.rank)}` : "-",
      badges: user?.badges || 0,
    },
    nextBadge: {
      name: "3-Peat",
      current: Math.min(approved, 3),
      target: 3,
    },
    feed: feed.map(feedShape),
  });
}

function ordinal(number) {
  if ([11, 12, 13].includes(number % 100)) return "th";
  return { 1: "st", 2: "nd", 3: "rd" }[number % 10] || "th";
}
