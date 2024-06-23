import db from "@/lib/db";
import { LogIn } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

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
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: accessTokenParams,
  });

  const accessTokenData = await accessTokenResponse.json();

  if (accessTokenData.error) {
    return new Response(null, { status: 400 });
  }

  const userProfileResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${accessTokenData.access_token}`,
      cache: "no-cache",
    },
  });

  const userProfileData = await userProfileResponse.json();

  const { id, properties: { nickname, profile_image } } = userProfileData;

  const user = await db.user.findFirst({
    where: {
      OR: [{ email: `${nickname}@kakao.com` }, { kakao_id: id.toString() }],
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await LogIn(user.id);
  } else {
    const dbUser = await db.user.findUnique({
      where: {
        username: nickname,
      },
      select: {
        id: true,
      },
    });
    let username = nickname;
    if (dbUser) {
      username += id;
    }
    const newUser = await db.user.create({
      data: {
        username,
        email: `${nickname}@kakao.com`,
        kakao_id: id.toString(),
        avatar: profile_image ?? "https://avatars.githubusercontent.com/u/169572985?v=4",
      },
      select: {
        id: true,
      },
    });
    await LogIn(newUser.id);
  }

  return redirect("/profile");
}
