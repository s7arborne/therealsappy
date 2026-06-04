import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "MISSING";
  const testPw = "sappy2026";
  let match = false;
  try {
    match = bcrypt.compareSync(testPw, hash);
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e), hash: hash.slice(0, 10), hashLen: hash.length });
  }
  return NextResponse.json({ match, hashPrefix: hash.slice(0, 10), hashLen: hash.length });
}
