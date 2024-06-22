"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { postSchema } from "./schema";
import { revalidatePath, revalidateTag } from "next/cache";

export async function uploadPost(formData: FormData) {
  const session = await getSession();
  if (!session.id) return;
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };
  const result = postSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const post = await db.post.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
    revalidatePath("/life");
    revalidateTag("/posts");
    redirect(`/posts/${post.id}`);
  }
}
