import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
      product: {
        select: {
          id: true,
          title: true,
          isSold: true,
          userId: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));
    if (!canSee) return null;
  }
  return room;
}

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      isRead: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

async function getUserProfile(userId: number) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });
  return user;
}

function getCachedUserProfile(userId: number) {
  const cachedOperation = nextCache(
    getUserProfile,
    [`user-profile-${userId}`],
    { tags: [`user-profile-${userId}`] }
  );
  return cachedOperation(userId);
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

const ChatRoom = async ({ params }: { params: { id: string } }) => {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const readMessage = async (messageId: number) => {
    "use server";
    await db.message.update({
      where: {
        id: messageId,
      },
      data: {
        isRead: true,
      },
    });
    revalidateTag(`chat-list`);
  };
  if (
    initialMessages.length > 0 &&
    initialMessages[initialMessages.length - 1].userId !== session.id! &&
    !initialMessages[initialMessages.length - 1].isRead
  ) {
    readMessage(initialMessages[initialMessages.length - 1].id);
  }
  const user = await getCachedUserProfile(session.id!);
  if (!user) {
    return notFound();
  }
  const onSold = async () => {
    "use server";
    await db.product.update({
      where: {
        id: room.productId,
      },
      data: {
        isSold: true,
      },
      select: {
        id: true,
      },
    });
    const users = room.users;
    revalidateTag(
      `user-profile-${users.filter((user) => user.id !== session.id)[0]}`
    );
    revalidateTag(`user-profile-${session.id}`);
    revalidateTag("chat-list");
  };
  const users = room.users;
  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      buyerId={users.filter((user) => user.id !== session.id)[0].id}
      username={user.username}
      avatar={user.avatar ?? ""}
      initialMessages={initialMessages}
      readMessage={readMessage}
      product={room.product}
      onSold={onSold}
    />
  );
};

export default ChatRoom;
