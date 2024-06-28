import { z } from "zod";

export const avatarSchema = z.object({
  avatar: z.string().url(),
});
export type AvatarType = z.infer<typeof avatarSchema>;
