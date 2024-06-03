"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default async function getSession(isPlain?: boolean) {
  const session = await getIronSession<SessionContent>(cookies(), {
    cookieName: "session",
    password: process.env.COOKIE_PASSWORD!,
  });
  if (isPlain) {
    return { id: session.id };
  }
  return session;
}