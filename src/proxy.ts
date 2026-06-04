import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_PATH = process.env.ADMIN_PATH ?? "admin";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(`/${ADMIN_PATH}`)) return NextResponse.next();
  if (pathname === `/${ADMIN_PATH}/login`) return NextResponse.next();

  const token = request.cookies.get("admin_session")?.value;
  if (!token) return redirectToLogin(request);

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "");
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = `/${ADMIN_PATH}/login`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
