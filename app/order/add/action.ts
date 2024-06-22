// order/add/action.ts

"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { OrderType, orderSchema } from "./schema";

interface OrderErrorType {
  fieldErrors?: {
    items?: {
      title?: string[];
      price?: string[];
      quantity?: string[];
    }[];
  };
}

export async function addOrder(data: OrderType): Promise<OrderErrorType | null> {
  const session = await getSession();
  if (!session?.id) return null;
  
  const result = orderSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten() as OrderErrorType;
  }

  await Promise.all(
    result.data.items.map(async (item) => {
      const drink = await db.drink.findUnique({
        where: { title: item.title },
      });

      if (!drink) {
        return {
          fieldErrors: {
            items: [
              {
                title: ["Drink not found"],
              }
            ],
          },
        };
      }

      await db.order.create({
        data: {
          orderDate: new Date(),
          deliveryDate: new Date(),
          quantity: item.quantity,
          user: {
            connect: {
              id: session.id,
            },
          },
          drink: {
            connect: {
              id: drink.id,
            },
          },
        },
        select: { id: true },
      });
    })
  );

  redirect("/live");
  return null;
}
