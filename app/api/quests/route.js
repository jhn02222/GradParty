import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { ensureSeedData } from "../../lib/seed";

export async function GET() {
  await ensureSeedData();
  const quests = await prisma.quest.findMany({ where: { active: true }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({
    quests: quests.map((quest) => ({
      ...quest,
      category: titleCase(quest.category),
      status: "available",
    })),
  });
}

function titleCase(value) {
  return value.slice(0, 1) + value.slice(1).toLowerCase();
}
