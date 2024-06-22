import * as z from "zod";

export const itemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().nonnegative("Price must be non-negative"),
  quantity: z.number().int().positive("Quantity must be positive"),
});

export const orderSchema = z.object({
  items: z.array(itemSchema),
});

export type OrderType = z.infer<typeof orderSchema>;
