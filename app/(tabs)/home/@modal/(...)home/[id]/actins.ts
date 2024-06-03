"use server";

import db from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export const onDelete = async (id: number, isOwner: boolean) => {
  if (!isOwner) return;
  const product = await db.product.delete({
    where: {
      id,
    },
    select: {
      photo: true,
    },
  });
  const photoId = product.photo.split(
    "https://imagedelivery.net/KqZxDrhOWGq2ozBEZgX2Zw/"
  )[1];
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v1/${photoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  revalidatePath("/home");
  revalidateTag("product-detail");
};
