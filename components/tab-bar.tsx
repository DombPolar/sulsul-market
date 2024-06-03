"use client";

import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  VideoCameraIcon as SolidVideoCameraIcon,
  UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  VideoCameraIcon as OutlineVideoCameraIcon,
  UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TabBar = () => {
  const pathname = usePathname();
  return (
    <div className="bg-neutral-800 fixed bottom-0 w-full mx-auto max-w-md grid grid-cols-5 border-neutral-600 border-t px-5 py-3 *:text-white">
      <Link href="/home" className="flex flex-col items-center gap-px">
        {pathname === "/home" ? (
          <SolidHomeIcon className="size-7" />
        ) : (
          <OutlineHomeIcon className="size-7" />
        )}
        <span>홈</span>
      </Link>
      <Link href="/life" className="flex flex-col items-center gap-px">
        {pathname === "/life" ? (
          <SolidNewspaperIcon className="size-7" />
        ) : (
          <OutlineNewspaperIcon className="size-7" />
        )}
        <span>공지사항</span>
      </Link>
      <Link href="/chat" className="flex flex-col items-center gap-px">
        {pathname === "/chat" ? (
          <SolidChatIcon className="size-7" />
        ) : (
          <OutlineChatIcon className="size-7" />
        )}
        <span>주문내역</span>
      </Link>
      <Link href="/live" className="flex flex-col items-center gap-px">
        {pathname === "/live" ? (
          <SolidVideoCameraIcon className="size-7" />
        ) : (
          <OutlineVideoCameraIcon className="size-7" />
        )}
        <span>라이브</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-px">
        {pathname === "/profile" ? (
          <SolidUserIcon className="size-7" />
        ) : (
          <OutlineUserIcon className="size-7" />
        )}
        <span>프로필</span>
      </Link>
    </div>
  );
};

export default TabBar;
