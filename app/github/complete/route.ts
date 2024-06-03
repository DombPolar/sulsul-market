import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return notFound();
  }

  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const accessTokenUrl = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  const { error, access_token } = await (
    await fetch(accessTokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if (error) {
    return new Response(null, { status: 400 });
  }

  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      cache: "no-cache",
    },
  });

  const { id, avatar_url, login } = await userProfileResponse.json();

  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });

  if (user) {
    const session = await getSession() as any;
    session.id = user.id;
    if (typeof session.save === 'function') {
      await session.save();
    }
    return redirect("/profile");
  }

  const newUser = await db.user.create({
    data: {
      github_id: id + "",
      email: `${login}@github.com`, // email 필드 사용
      avatar: avatar_url,
      username: login, // username 필드 사용
    },
    select: {
      id: true,
    },
  });

  if (newUser) {
    const session = await getSession() as any;
    session.id = newUser.id;
    if (typeof session.save === 'function') {
      await session.save();
    }
    return redirect("/profile");
  }
}
