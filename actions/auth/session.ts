"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt, encrypt } from "./jwt";

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  console.log(session);
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
