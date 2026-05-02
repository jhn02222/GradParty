import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { ensureSeedData, initials } from "../../lib/seed";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    await ensureSeedData();
    const body = await request.json();
    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const photoUrl = String(body.photoUrl || "");
    const user = await prisma.user.create({
      data: {
        name,
        nickname: String(body.nickname || "").trim() || null,
        photoUrl: photoUrl || initials(name),
      },
      include: { _count: { select: { badges: true } } },
    });

    await prisma.feedItem.create({
      data: {
        userId: user.id,
        type: "QUEST_SUBMITTED",
        text: "joined the party!",
        points: 0,
        icon: "GO",
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Join failed", error);
    return NextResponse.json({ error: "Could not create profile" }, { status: 500 });
  }
}
