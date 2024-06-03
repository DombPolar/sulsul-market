"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

const DEFAULT_COOKIE_PASSWORD: string = "default_password";

export default async function getSession(isPlain?: boolean) {
  const password: string = process.env.COOKIE_PASSWORD ?? DEFAULT_COOKIE_PASSWORD;
  const session = await getIronSession<SessionContent>(cookies(), {
    cookieName: "session",
    password,
  });
  if (isPlain) {
    return { id: session.id };
  }
  return session;
}
