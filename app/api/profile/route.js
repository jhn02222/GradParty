import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { rankedUsers, userShape } from "../../lib/game";
import { ensureSeedData } from "../../lib/seed";

export async function GET(request) {
  await ensureSeedData();
  const userId = new URL(request.url).searchParams.get("userId");
  const leaders = await rankedUsers(100);
  const dbUser = userId
    ? await prisma.user.findUnique({ where: { id: userId }, include: { _count: { select: { badges: true } } } })
    : null;
  const fallback = await prisma.user.findFirst({
    orderBy: { points: "desc" },
    include: { _count: { select: { badges: true } } },
  });
  const user = dbUser || fallback;
  const rank = leaders.find((leader) => leader.id === user?.id)?.rank || 1;
  return NextResponse.json({ user: user ? userShape(user, rank) : null });
}
