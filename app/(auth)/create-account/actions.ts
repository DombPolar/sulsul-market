"use server";

import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import { LogIn } from "@/lib/utils";

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "이름은 문자열이 되어야 합니다.",
        required_error: "이름은 필수 항목입니다.",
      })
      .trim(),
    email: z
      .string({
        invalid_type_error: "이메일은 문자열이 되어야 합니다.",
        required_error: "이메일은 필수 항목입니다.",
      })
      .email()
      .toLowerCase(),
    password: z
      .string({
        invalid_type_error: "비밀번호는 문자열이 되어야 합니다.",
        required_error: "비밀번호는 필수 항목입니다.",
      })
      .min(
        PASSWORD_MIN_LENGTH,
        `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}글자 이상 입력해 주세요.`
      )
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z
      .string({
        invalid_type_error: "확인 비밀번호는 문자열이 되어야 합니다.",
        required_error: "확인 비밀번호는 필수 항목입니다.",
      })
      .min(
        PASSWORD_MIN_LENGTH,
        `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}글자 이상 입력해 주세요.`
      ),
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용 중인 이메일입니다.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용 중인 이름입니다.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: "확인 비밀번호가 일치하지 않습니다.",
    path: ["confirm_password"],
  });

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
        avatar: "https://avatars.githubusercontent.com/u/169572985?v=4", // 변경된 부분
      },
      select: {
        id: true,
      },
    });
    await LogIn(user.id);
    redirect("/profile");
  }
};
