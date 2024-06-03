import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";


const SocialLogin = () => {
  return (
    <>
      <div className="w-full h-px bg-neutral-500 rounded-full" />
      <div className="flex flex-col gap-3">
        
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-3"
          href="/github/start"
        >
          <span>
            <Image width={24} height={24} src="/github.svg" alt="Github Logo" />
          </span>
          <span>Continue with Github</span>
        </Link>

        <Link
          className="primary-btn flex h-10 items-center justify-center gap-3"
          href="/sms"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </span>
          <span>Continue with SMS</span>
        </Link>

        <Link
          className="primary-btn flex h-10 items-center justify-center gap-3"
          href="/kakao/start"
        >
          <span>
          <Image width={24} height={24} src="/kakao.svg" alt="KAKAO LOGO" />
          </span>
          <span>Continue with KAKAO</span>
        </Link>
      </div>
    </>
  );
};

export default SocialLogin;
