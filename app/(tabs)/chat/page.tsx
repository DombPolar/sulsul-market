import ListChat from "@/components/list-chat";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { unstable_cache as nextCache } from "next/cache";

// 채팅방 정보를 가져오는 함수
const getChats = async (userId: number) => {
  const chats = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      messages: {
        take: 1,
        orderBy: {
          created_at: "desc",
        },
      },
      users: {
        where: {
          id: {
            not: userId,
          },
        },
        select: {
          avatar: true,
          username: true,
        },
      },
      product: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return chats;
};

// 캐시된 채팅방 정보를 가져오는 함수
const getCachedChats = nextCache(getChats, ["chat-list"], {
  tags: ["chat-list"],
});

// 페이지 컴포넌트
const ChatPage = async () => {
  const session = await getSession();
  const chats = await getCachedChats(session.id!);

  return (
    <div>
      <h1 className="text-4xl mb-3">채팅방</h1>
      {chats.map((chat, idx) => (
        <ListChat
          id={chat.id}
          key={idx}
          messages={chat.messages}
          users={chat.users}
          userId={session.id!}
          productTitle={chat.product?.title}  // 제품 제목을 ListChat에 전달
        />
      ))}
    </div>
  );
};

export default ChatPage;
