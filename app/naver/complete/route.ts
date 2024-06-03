import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return notFound();
  }

  const accessTokenParams = new URLSearchParams({
    client_id: process.env.NAVER_CLIENT_ID!,
    client_secret: process.env.NAVER_CLIENT_SECRET!,
    code,
    state,
    grant_type: "authorization_code",
    redirect_uri: process.env.NAVER_REDIRECT_URL!,
  }).toString();

  const accessTokenUrl = `https://nid.naver.com/oauth2.0/token?${accessTokenParams}`;

  const tokenResponse = await fetch(accessTokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  
  const tokenData = await tokenResponse.json();
  
  if (tokenData.error) {
    return new Response(null, { status: 400 });
  }

  const { access_token } = tokenData;

  const userProfileResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      cache: "no-cache",
    },
  });

  const userProfileData = await userProfileResponse.json();

  if (userProfileData.resultcode !== "00") {
    return new Response(null, { status: 400 });
  }

  const { response: { id, name, profile_image: avatar_url, email } } = userProfileData;

  const user = await db.user.findFirst({
    where: {
      OR: [
        { naver_id: id },
        { email: email }
      ]
    },
    select: {
      id: true,
    },
  });

  if (user) {
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect("/profile");
  }

  const newUser = await db.user.create({
    data: {
      naver_id: id,
      email,
      username: name || 'default_username',
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });

  if (newUser) {
    const session = await getSession();
    session.id = newUser.id;
    await session.save();
    return redirect("/profile");
  }
}
