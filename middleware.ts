import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
  "/kakao/start": true,
  "/kakao/complete": true,
  "/naver/start": true,
  "/naver/complete": true,
  "/google/complete": true,
  "/google/start": true,

};

export async function middleware(req: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[req.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    if (exists) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|github.svg|kakao.svg|google.svg|User.svg).*)"],
};
