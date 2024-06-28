import db from "@/lib/db";
import getSession from "@/lib/session";
import { avatarSchema } from "./schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect, notFound } from "next/navigation";

export async function uploadAvatar(formData: { avatar: string }) {
  const session = await getSession();
  if (!session.id) return;

  const data = avatarSchema.safeParse(formData);
  if (!data.success) {
    return data.error.flatten();
  } else {
    const avatar = await db.user.update({
      where: { id: session.id },
      data: { avatar: data.data.avatar },
    });

    revalidatePath(`/profile/${session.id}`);
    revalidateTag("user_profile");
    redirect(`/profile/${session.id}`);
  }
}

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      }
    }
  );
  const data = await response.json();
  return data;
}

export async function getUser() {
  const session = await getSession();
  if (!session || !session.id) {
    notFound();
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
  });
  
  if (!user) {
    notFound();
  }

  return user;
}
