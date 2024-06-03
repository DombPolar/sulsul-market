"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { smsLogIn } from "./actions";

const initialState: any = {
  token: false,
  phone: "",
  error: undefined,
};

const SMSLogIn = () => {
  const [state, dispatch] = useFormState(smsLogIn, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {!state?.token ? (
          <Input
            name="phone"
            type="text"
            placeholder="Phone number"
            required
            errors={state?.error?.formErrors}
            key="phone"
          />
        ) : (
          <Input
            name="token"
            type="number"
            min={100000}
            max={999999}
            placeholder="Verification code"
            required
            errors={state?.error?.fieldErrors?.token}
            key="token"
          />
        )}
        <Button
          text={state?.token ? "인증 번호 인증하기" : "인증 번호 발송하기"}
        />
      </form>
    </div>
  );
};

export default SMSLogIn;
