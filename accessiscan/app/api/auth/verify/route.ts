// Vérifie le jeton du lien magique et ouvre la session (cookie httpOnly).
import { NextResponse } from "next/server";
import { getCustomerByToken } from "@/lib/store";
import { config, SESSION_COOKIE } from "@/lib/config";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const customer = getCustomerByToken(token);
  if (!customer) {
    return NextResponse.redirect(`${config.appUrl}/login?error=lien-invalide`);
  }
  const response = NextResponse.redirect(`${config.appUrl}/dashboard`);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.appUrl.startsWith("https"),
    maxAge: 60 * 60 * 24 * 90, // 90 jours
    path: "/",
  });
  return response;
}
