import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { unstable_cache as nextCache } from "next/cache";

const getOrders = async () => {
  const orders = await db.order.findMany({
    include: {
      drink: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  return orders;
};

const getCachedOrders = nextCache(getOrders, ["orders"], { tags: ["orders"] });

const LivePage = async () => {
  const orders = await getCachedOrders();
  return (
    <div className="min-h-screen flex flex-col gap-5 p-5 bg-neutral-900 text-white">
      <h1 className="text-4xl mb-3">발주📋</h1>
      {orders.map((order) => (
        <Link
          className="pb-5 mb-5 border-b border-neutral-400 text-neutral-400 flex flex-col last:pb-0 last:border-b-0"
          key={order.id}
          href={`/orderlist/${order.id}`}
        >
          <h2 className="text-blue-500 text-lg font-semibold">
            {order.drink.title} - 수량: {order.quantity} {/* title 필드로 변경 */}
          </h2>
          <div className="mb-2">
            주문자: {order.user.username}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-1 items-center">
              <span>주문일: {formatToTimeAgo(order.orderDate.toString())}</span>
              <span>·</span>
              <span>배송일: {formatToTimeAgo(order.deliveryDate.toString())}</span>
            </div>
          </div>
        </Link>
      ))}
      <Link
        href="/order/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 left-0 right-0 mx-auto translate-x-36 sm:translate-x-44 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
};

export default LivePage;
