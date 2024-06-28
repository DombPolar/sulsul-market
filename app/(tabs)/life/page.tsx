import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { unstable_cache as nextCache } from "next/cache";

const getPosts = async () => {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });
  return posts;
};

const getCachedPosts = nextCache(getPosts, ["posts"], { tags: ["posts"] });

export const metadata = {
  title: "공지사항",
};

const LifePage = async () => {
  const posts = await getCachedPosts();
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-5 flex flex-col">
      <h1 className="text-4xl mb-3">공지사항📢</h1>
      {posts.map((post) => (
        <Link
          className="pb-5 mb-5 border-b border-neutral-400 text-neutral-400 flex flex-col last:pb-0 last:border-b-0"
          key={post.id}
          href={`/posts/${post.id}`}
        >
          <h2 className="text-blue-500 text-lg font-semibold">{post.title}</h2>
          <p className="mb-2">{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-1 items-center">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
              <span className="flex gap-1 items-center">
                <HandThumbUpIcon className="size-4" />
                {post._count.likes}
              </span>
              <span className="flex gap-1 items-center">
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.comments}
              </span>
            </div>
          </div>
        </Link>
      ))}
      <Link
        href="./life/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 left-0 right-0 mx-auto translate-x-36 sm:translate-x-44 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
};

export default LifePage;
