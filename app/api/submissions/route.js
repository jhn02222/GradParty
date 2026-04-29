import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { ensureSeedData, initials } from "../../lib/seed";

export async function POST(request) {
  await ensureSeedData();
  const body = await request.json();
  const quest = await prisma.quest.findUnique({ where: { id: body.questId } });
  if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });

  let user = body.userId ? await prisma.user.findUnique({ where: { id: body.userId } }) : null;
  if (!user) {
    user = await prisma.user.create({
      data: { name: "Guest Grad", photoUrl: initials("Guest Grad") },
    });
  }

  const submission = await prisma.submission.create({
    data: {
      userId: user.id,
      questId: quest.id,
      photoUrl: body.photoUrl || null,
      caption: body.caption || null,
      points: Number(body.points ?? quest.points),
      drinks: Number(body.drinks ?? quest.drinks),
    },
    include: { user: true, quest: true },
  });

  await prisma.feedItem.create({
    data: {
      userId: user.id,
      type: "QUEST_SUBMITTED",
      text: `submitted ${quest.title}!`,
      points: submission.points,
      icon: quest.icon,
    },
  });

  return NextResponse.json({ submission });
}
