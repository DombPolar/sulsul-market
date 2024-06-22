import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return notFound();
  }

  const accessTokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT_ID!,
    client_secret: process.env.KAKAO_CLIENT_SECRET!,
    redirect_uri: process.env.KAKAO_REDIRECT_URL!,
    code,
  }).toString();

  const accessTokenUrl = `https://kauth.kakao.com/oauth/token`;

  const accessTokenResponse = await fetch(accessTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    body: accessTokenParams
  });

  const accessTokenData = await accessTokenResponse.json();

  if (accessTokenData.error) {
    console.error('Error fetching access token:', accessTokenData.error);
    return new Response(null, { status: 400 });
  }

  const { access_token } = accessTokenData;

  const userProfileResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      cache: "no-cache",
    },
  });

  const userProfileData = await userProfileResponse.json();

  if (!userProfileData.id || !userProfileData.properties.nickname) {
    console.error('Error fetching user profile:', userProfileData);
    return new Response(null, { status: 400 });
  }

  const { id, properties: { nickname } } = userProfileData;

  let user = await db.user.findUnique({
    where: {
      kakao_id: id.toString(),
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        username: nickname,
        kakao_id: id.toString(),
        avatar: "https://avatars.githubusercontent.com/u/169572985?v=4", 
        email: `${nickname}@kakao.com`,
      },
      select: {
        id: true,
      },
    });
  }

  if (user) {
    const session = await getSession();
    session.id = user.id;
    return NextResponse.redirect("/profile");
  }

  return new Response(null, { status: 500 });
}
