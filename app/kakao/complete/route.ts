import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    console.log("Authorization code not found");
    return notFound();
  }

  console.log("Authorization code found:", code);

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
  const { error, access_token } = accessTokenData;

  if (error) {
    console.log("Error fetching access token:", error, accessTokenData);
    return new Response(null, { status: 400 });
  }

  console.log("Access token obtained:", access_token);

  const userProfileResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      cache: "no-cache",
    },
  });

  const userProfileData = await userProfileResponse.json();
  const id = userProfileData.id;
  const nickname = userProfileData.properties.nickname;

  console.log("User profile fetched:", id, nickname);

  // 사용자 확인 또는 생성
  let user = await db.user.findUnique({
    where: {
      kakao_id: id.toString(),
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
    });
    console.log("New user created:", user);
  } else {
    console.log("Existing user found:", user);
  }

  // 세션 설정
  const session = await getSession();

  if (!session) {
    console.log("Failed to retrieve session");
    return new Response(null, { status: 500 });
  }

  session.id = user.id;
  console.log("Session set for user:", session);

  // 세션 설정 후 리디렉션
  return redirect("/profile");
}
