import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { awardBadges } from "../../lib/game";
import { ensureSeedData, initials } from "../../lib/seed";

export async function POST(request) {
  await ensureSeedData();
  const body = await request.json();
  const quest = await prisma.quest.findUnique({ where: { id: body.questId } });
  if (!quest) return NextResponse.json({ error: "Submission target not found" }, { status: 404 });

  let user = body.userId ? await prisma.user.findUnique({ where: { id: body.userId } }) : null;
  if (!user) {
    const fallbackName = String(body.userName || "Guest Grad").trim();
    user = await prisma.user.create({
      data: { name: fallbackName, photoUrl: initials(fallbackName) },
    });
  }

  const points = Number(body.points ?? quest.points);
  const drinks = Number(body.drinks ?? quest.drinks);

  const submission = await prisma.$transaction(async (tx) => {
    const created = await tx.submission.create({
      data: {
        userId: user.id,
        questId: quest.id,
        photoUrl: body.photoUrl || null,
        caption: body.caption || null,
        status: "APPROVED",
        points,
        drinks,
        reviewedAt: new Date(),
      },
      include: { user: true, quest: true },
    });

    await tx.user.update({
      where: { id: user.id },
      data: {
        points: { increment: points },
        drinks: { increment: drinks },
      },
    });

    await tx.feedItem.create({
      data: {
        userId: user.id,
        type: "QUEST_APPROVED",
        text: drinks ? "logged a drink proof!" : "submitted a party proof!",
        points,
        icon: drinks ? "CUP" : "CAM",
      },
    });

    return created;
  });

  await awardBadges(user.id, quest.title);

  return NextResponse.json({ submission });
}
