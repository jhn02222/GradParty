import { NextResponse } from "next/server";
import { bucketConfigReady, putFile } from "../../lib/bucket";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

export async function POST(request) {
  if (!bucketConfigReady()) {
    return NextResponse.json({ error: "Railway bucket is not configured" }, { status: 500 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") || "uploads").replace(/[^a-z0-9/_-]/gi, "");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "A file is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "Image must be 8MB or smaller" }, { status: 400 });
  }

  const extension = file.name?.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await putFile({
    key,
    body: buffer,
    contentType: file.type,
  });

  return NextResponse.json({
    key,
    url: `/api/files?key=${encodeURIComponent(key)}`,
  });
}
