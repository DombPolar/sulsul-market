import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "제목을 입력해 주세요."),
  description: z.string().optional(),
});

export type PostType = z.infer<typeof postSchema>;
