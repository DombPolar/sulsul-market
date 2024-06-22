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

  const { error, access_token } = await accessTokenResponse.json();

  if (error) {
    console.log("Error fetching access token:", error);
    return new Response(null, { status: 400 });
  }

  console.log("Access token obtained:", access_token);

  const userProfileResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      cache: "no-cache",
    },
  });

  const { id, properties: { nickname } } = await userProfileResponse.json();

  console.log("User profile fetched:", id, nickname);

  const user = await db.user.findUnique({
    where: {
      kakao_id: id.toString(),
    },
    select: {
      id: true,
    },
  });

  if (user) {
    console.log("Existing user found:", user);
    const session = await getSession();
    session.id = user.id;
    // 세션을 변경한 후 별도의 저장 메서드를 호출할 필요 없음
    return redirect("/profile");
  }

  const newUser = await db.user.create({
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

  if (newUser) {
    console.log("New user created:", newUser);
    const session = await getSession();
    session.id = newUser.id;
    // 세션을 변경한 후 별도의 저장 메서드를 호출할 필요 없음
    return redirect("/profile");
  }

  console.log("User creation failed, or session not set correctly");
}
