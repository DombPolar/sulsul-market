// orderlist/[id]/page.tsx

import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";

const getOrder = async (id: number) => {
  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: true, // 전체 user 정보를 포함합니다.
        drink: true, // 전체 drink 정보를 포함합니다.
      },
    });
    if (!order) return null;
    return order;
  } catch (e) {
    return null;
  }
};

const getCachedOrder = nextCache(getOrder, ["order-detail"], { revalidate: 60 });

const OrderDetail = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const order = await getCachedOrder(id);
  if (!order) {
    return notFound();
  }
  return (
    <div className="p-5 text-white">
      {order.user.avatar && (
        <div className="flex items-center gap-2 mb-2">
          <img
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={order.user.avatar} // 사용자 아바타 URL
            alt={order.user.username}
          />
          <div>
            <span className="text-sm font-semibold">{order.user.username}</span>
            <div className="text-xs">
              <span>{formatToTimeAgo(order.orderDate.toString())}</span>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-lg font-semibold">{order.drink.title}</h2> {/* title 필드로 변경 */}
      <p className="mb-5">수량: {order.quantity}</p>
      <div className="flex flex-col gap-5 items-start mb-10">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <span>주문일: {formatToTimeAgo(order.orderDate.toString())}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <span>배송일: {formatToTimeAgo(order.deliveryDate.toString())}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
