import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/adminAuth";
import { awardBadges } from "../../../../lib/game";

export async function PATCH(request, { params }) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  const { status } = await request.json();
  if (!["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { id } = await params;
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { user: true, quest: true },
  });
  if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  if (submission.status !== "PENDING") {
    return NextResponse.json({ submission, alreadyReviewed: true });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const reviewed = await tx.submission.update({
      where: { id: submission.id },
      data: { status, reviewedAt: new Date() },
      include: { user: true, quest: true },
    });

    if (status === "APPROVED") {
      await tx.user.update({
        where: { id: submission.userId },
        data: {
          points: { increment: submission.points },
          drinks: { increment: submission.drinks },
        },
      });
      await tx.feedItem.create({
        data: {
          userId: submission.userId,
          type: "QUEST_APPROVED",
          text: submission.drinks ? "logged a drink proof!" : "submitted a party proof!",
          points: submission.points,
          icon: submission.drinks ? "CUP" : "CAM",
        },
      });
    }
    return reviewed;
  });

  if (status === "APPROVED") {
    await awardBadges(submission.userId, submission.quest.title);
  }

  return NextResponse.json({ submission: updated });
}
