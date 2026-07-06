import { NextResponse } from "next/server";
import { config, SESSION_COOKIE } from "@/lib/config";

export async function POST() {
  const response = NextResponse.redirect(`${config.appUrl}/`, { status: 303 });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
