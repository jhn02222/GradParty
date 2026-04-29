import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { feedShape } from "../../lib/game";
import { ensureSeedData } from "../../lib/seed";

export async function GET() {
  await ensureSeedData();
  const feed = await prisma.feedItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { user: true },
  });
  return NextResponse.json({ feed: feed.map(feedShape) });
}
