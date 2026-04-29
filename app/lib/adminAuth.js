import { NextResponse } from "next/server";

export function requireAdmin(request) {
  const pin = process.env.ADMIN_PIN;
  if (!pin) return null;
  const supplied = request.headers.get("x-admin-pin");
  if (supplied === pin) return null;
  return NextResponse.json({ error: "Admin PIN required" }, { status: 401 });
}
