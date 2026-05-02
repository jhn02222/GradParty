import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { ensureSeedData } from "../../../lib/seed";
import { requireAdmin } from "../../../lib/adminAuth";

export async function GET(request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  await ensureSeedData();
  const submissions = await prisma.submission.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { user: true, quest: true },
  });
  return NextResponse.json({
    submissions: submissions.map((submission) => ({
      id: submission.id,
      user: submission.user.name,
      photo: submission.user.photoUrl || submission.user.name.slice(0, 2).toUpperCase(),
      label: submission.drinks ? "Drink proof" : "Party proof",
      caption: submission.caption || "",
      points: submission.points,
      drinks: submission.drinks,
      photoUrl: submission.photoUrl,
      createdAt: submission.createdAt,
    })),
  });
}
