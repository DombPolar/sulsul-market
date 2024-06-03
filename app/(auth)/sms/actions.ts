"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import { LogIn } from "@/lib/utils";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "올바른 전화번호 형식으로 입력해 주세요."
  );

async function tokenExists({ token, phone }: { token: number; phone: string }) {
  console.log(token, phone);
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
      phone,
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

const tokenSchema = z
  .object({
    token: z.coerce
      .number({ required_error: "인증번호를 입력해 주세요." })
      .min(100000, "올바른 인증번호 형식으로 입력해 주세요.")
      .max(999999, "올바른 인증번호 형식으로 입력해 주세요."),
    phone: z
      .string()
      .refine(validator.isMobilePhone, "전화번호 형식이 올바르지 않습니다."),
  })
  .refine(tokenExists, {
    message: "인증번호가 틀립니다.",
    path: ["token"],
  });

interface ActionState {
  token: boolean;
  phone: string;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return await getToken();
  } else {
    return token;
  }
}

export async function smsLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone") ?? prevState.phone;
  const token = formData.get("token");
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        phone,
        error: result.error.flatten(),
      };
    } else {
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          phone: phone + "",
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      // const client = twilio(
      //   process.env.TWILIO_ACCOUNT_SID,
      //   process.env.TWILIO_AUTH_TOKEN
      // );
      // await client.messages.create({
      //   body: `당신의 술술 인증 번호는 ${token}입니다.`,
      //   from: process.env.TWILIO_PHONE_NUMBER!,
      //   to: process.env.MY_PHONE_NUMBER!,
      // });
      return {
        token: true,
        phone,
      };
    }
  } else {
    const result = await tokenSchema.spa({ token, phone });
    if (!result.success) {
      return {
        error: result.error.flatten(),
        phone,
        token: true,
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          phone: phone + "",
          token: result.data.token + "",
        },
        select: {
          id: true,
          userId: true,
        },
      });
      await LogIn(token!.userId);
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });
      redirect("/profile");
    }
  }
}
