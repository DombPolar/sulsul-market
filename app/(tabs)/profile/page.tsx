import db from "@/lib/db";
import getSession from "@/lib/session";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const getUser = async () => {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
};

const Profile = async () => {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session: any = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex justify-center items-center p-4">
      <div className="flex flex-col items-center gap-4 p-6 bg-neutral-800 rounded-md">
        {user?.avatar && (
          <img
            src={user.avatar}
            alt={`${user.username}'s avatar`}
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <h1 className="text-2xl font-bold">Welcome! {user?.username}!</h1>
        <Link
          href={`/user/${user.id}`}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-300  rounded-md text-white"
        >
          프로필 보기
        </Link>
        <Link
          className="px-4 py-2 bg-blue-500 hover:bg-cyan-400 rounded-md text-white cursor-pointer"
          href={`/profile/edit`}
        >
          프로필 수정
        </Link>
        <form action={logOut}>
          <button className="px-6 py-2 bg-red-500 hover:bg-rose-500 rounded-md text-white cursor-pointer">로그아웃</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
