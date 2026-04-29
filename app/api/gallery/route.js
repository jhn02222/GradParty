import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { ensureSeedData } from "../../lib/seed";

export async function GET() {
  await ensureSeedData();
  const approved = await prisma.submission.findMany({
    where: { status: "APPROVED" },
    orderBy: { reviewedAt: "desc" },
    take: 50,
    include: { user: true, quest: true },
  });

  const gallery = approved.map((submission, index) => ({
    id: submission.id,
    user: submission.user.name,
    quest: submission.quest.title,
    points: submission.points,
    photoUrl: submission.photoUrl,
    color: ["from-red-700 to-zinc-950", "from-zinc-200 to-red-800", "from-zinc-900 to-red-600"][index % 3],
  }));

  return NextResponse.json({ gallery });
}
