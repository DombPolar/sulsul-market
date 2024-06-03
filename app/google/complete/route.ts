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
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    code,
    grant_type: "authorization_code",
    redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
  }).toString();

  const accessTokenUrl = `https://oauth2.googleapis.com/token?${accessTokenParams}`;

  const { error, access_token } = await (
    await fetch(accessTokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  console.log("TOKEN :  ", access_token);

  if (error) {
    return new Response(null, { status: 400 });
  }
  const userProfileReponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      cache: "no-cache",
    },
  });

  const { sub: id, name, picture: avatar_url, email } = await userProfileReponse.json();

  const user = await db.user.findUnique({
    where: {
      google_id: id + "g",
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
      google_id: id + "g",
      email,
      name,
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