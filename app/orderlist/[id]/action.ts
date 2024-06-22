// "orderlist/[id]/action.ts"

"use server";

import db from "@/lib/db";
import { revalidateTag } from "next/cache";

export const deleteOrder = async (orderId: number) => {
  try {
    await db.order.delete({
      where: { id: orderId },
    });
    revalidateTag("orders");
    revalidateTag("order-detail");
  } catch (e) {
    console.error(e);
  }
};
