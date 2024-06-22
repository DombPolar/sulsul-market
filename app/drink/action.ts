// drink/action.ts

"use server";

import db from "@/lib/db";

export async function fetchDrinks() {
  const drinks = await db.drink.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      productCode: true,
    },
  });
  return drinks;
}
