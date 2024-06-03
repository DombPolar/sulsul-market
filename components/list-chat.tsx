import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

interface IListChatProps {
  id: string;
  users: {
    username: string;
    avatar: string | null;
  }[];
  messages: {
    id: number;
    payload: string;
    created_at: Date;
    updated_at: Date;
    chatRoomId: string;
    userId: number;
    isRead: boolean;
  }[];
  userId: number;
  productTitle: string; // Add productTitle to the interface
}

const ListChat = ({ id, users, messages, userId, productTitle }: IListChatProps) => {
  const user = users[0];
  if (!user) return null;
  const message = messages[0];
  return (
    <Link
      href={`/chats/${id}`}
      className="flex gap-5 p-5 items-center hover:opacity-80 transition-opacity"
    >
      {user.avatar ? (
        <Image
          src={
            user.avatar.startsWith("https://github.com")
              ? user.avatar
              : `${user.avatar}/avatar`
          }
          alt={user.username}
          width={60}
          height={60}
          className="rounded-md"
        />
      ) : (
        <UserIcon className="size-14 text-white" />
      )}
      <div>
        <h2 className="text-lg text-white">{user.username} - {productTitle}</h2> {/* Display product title */}
        {message && (
          <>
            <h3 className="text-sm text-neutral-500">
              <span className="text-neutral-400">
                {message.userId === userId ? "나" : user.username}:
              </span>{" "}
              {message.payload}
            </h3>
          </>
        )}
      </div>
      {message && !message.isRead && message.userId !== userId && (
        <div className="size-2 rounded-full bg-white ml-auto" />
      )}
    </Link>
  );
};

export default ListChat;
