import { SESSION_COOKIE_NAME } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.href === "/") {
    if (req.cookies[SESSION_COOKIE_NAME]) {
      return NextResponse.redirect("/projects", 302);
    }
    return NextResponse.redirect("/home", 302);
  }

  return NextResponse.next();
}
