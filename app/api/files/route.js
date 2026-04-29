import { NextResponse } from "next/server";
import { bucketConfigReady, getFile } from "../../lib/bucket";

export const runtime = "nodejs";

export async function GET(request) {
  if (!bucketConfigReady()) {
    return NextResponse.json({ error: "Railway bucket is not configured" }, { status: 500 });
  }

  const key = new URL(request.url).searchParams.get("key");
  if (!key || key.includes("..")) {
    return NextResponse.json({ error: "Invalid file key" }, { status: 400 });
  }

  const object = await getFile(key);
  return new Response(object.Body, {
    headers: {
      "Content-Type": object.ContentType || "application/octet-stream",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
