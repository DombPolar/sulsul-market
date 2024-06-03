import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen">
      <div className="my-auto *:font-medium flex flex-col items-center gap-5">
        <span className="text-8xl">🛒</span>
        <h1 className="text-4xl">술술</h1>
        <h2 className="text-2xl">WELCOME!</h2>
      </div>
      <div className="flex flex-col items-center gap-4 w-full p-6">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg">
          시작하기
        </Link>
        <div className="flex gap-1">
          <span>이미 계정이 있으신가요?</span>
          <Link href="/login" className="hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
