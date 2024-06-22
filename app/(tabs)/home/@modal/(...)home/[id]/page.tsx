import CloseButton from "@/components/close-button";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { formatToWon, getProduct } from "@/lib/utils";
import Link from "next/link";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import db from "@/lib/db";
import { revalidateTag } from "next/cache";

const Modal = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const product = await getProduct(id);
  if (!product) return notFound();
  const session = await getSession();
  const isOwner = session.id === product.userId;
  const createChatRoom = async () => {
    "use server";
    if (product.isSold) return;
    const roomExists = await db.chatRoom.findFirst({
      where: {
        productId: product.id,
      },
      select: {
        id: true,
      },
    });
    if (roomExists) {
      revalidateTag("chat-list");
      return redirect(`/chats/${roomExists.id}`);
    }
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id!,
            },
          ],
        },
        productId: id,
      },
      select: {
        id: true,
      },
    });
    revalidateTag("chat-list");
    redirect(`/chats/${room.id}`);
  };
  return (
    <div className="absolute z-50 w-full h-full flex items-center justify-center left-0 top-0 bg-black bg-opacity-60">
      <CloseButton />
      <div className="max-w-[20rem] w-full flex flex-col justify-center items-center bg-neutral-700 rounded-md overflow-hidden">
        <div className="aspect-square rounded-md flex items-center justify-center text-neutral-200 w-full relative">
          <Image
            fill
            src={`${product.photo}/public`}
            alt={product.title}
            className="h-28 object-cover"
          />
        </div>
        <div className="flex flex-col p-5 gap-5 w-full">
          <div className="flex gap-2 items-center">
            {product.user.avatar ? (
              <Image
                src={product.user.avatar}
                alt={product.user.username}
                width={40}
                height={40}
                className="object-cover rounded-full"
                priority
              />
            ) : (
              <UserIcon className="size-10" />
            )}
            <span>{product.user.username}</span>
          </div>
          <div className="h-[1px] w-full rounded-md bg-neutral-600" />
          <h1 className="text-xl font-semibold">{product.title}</h1>
          <h2 className="text-sm">{product.description}</h2>
          <div className="flex justify-between mt-6 items-center">
            <h3 className="font-semibold">{formatToWon(product.price)}원</h3>
            <div className="flex gap-3">
              {isOwner ? (
                <Link
                  href={`/home/${id}/edit`}
                  className="flex items-center justify-center px-2.5 py-1.5 bg-blue-500 rounded-md text-white font-semibold"
                >
                  편집
                </Link>
              ) : (
                <form action={createChatRoom}>
                  <button className="bg-blue-500 px-2.5 py-1.5 rounded-md text-white font-semibold">
                    채팅하기
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
