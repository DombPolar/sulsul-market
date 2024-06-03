/*
정규표현식으로 데이터 검증을 할 수 있습니다.

[.toLowerCase]
String 타입의 데이터를 모두 소문자로 변환해줍니다.

[.trim]
String 타입의 데이터에서 맨앞과 뒤에 붙은 공백을 제거해줍니다.

[.transform]
이 메서드를 이용하면 해당 데이터를 변환할 수 있습니다.
예시: .transform((username) => `🔥 ${username} 🔥`)

[zod 공식문서]
https://zod.dev/
*/

"use server";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";


const checkUsername = (username:string) => !username.includes("admin");
const checkPassword = ({password, confirm_password} : {password:string, confirm_password:string}) => password === confirm_password



const formSchema = z.object({
  username: z.string({
    invalid_type_error:"이름은 문자가 들어가야합니다."
  })
  .toLowerCase()
  .trim()
  //.transform((username) => '${username}')
  .refine(checkUsername, "No potatoes allowed!"),
  email: z.string().email().toLowerCase(),

  password: z.string().min(PASSWORD_MIN_LENGTH),
  //.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
  confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
})
// superrefine을 통해 DB 중복 호출을 방지하자고.. ctx = context , fatal 치명적인 오류, z.never 검사중단
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
      message: "중복되는 닉네임 입니다",
      path: ["username"],
      fatal: true,
    });
    return z.NEVER;
  }
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
      message: "이미 사용중인 이메일 입니다.",
      path: ["email"],
      fatal: true,
    });
    return z.NEVER;
  }
});

//await는 DB에서 찾는데 시간이 걸려서 딜레이 거는거임
export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formSchema.spa(data);
  if(!result.success){
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    // hash password, save the user to db
    const hashedPassword = await bcrypt.hash(result.data.password, 12); //해싱 알고리즘 12번 실행
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true, //select를 통해서 필요없는 정보는 다 거른다잉
      },
    });
    // log the user in
    // redirect "/home", 무작위 쿠키 전달 sssion DB 없이 사용하기 위해 iron-session 라이브러리 설치
    // nextJS를 통해 쿠키값 쉽게 받기
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/profile");
  }
  
}















<Link href="/live" className="flex flex-col items-center gap-px">
{pathname === "/live" ? (
  <SolidVideoCameraIcon className="size-7" />
) : (
  <OutlineVideoCameraIcon className="size-7" />
)}
<span>라이브</span>
</Link>