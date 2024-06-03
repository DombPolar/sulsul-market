import db from "./db";
import getSession from "./session";

export const LogIn = async (id: number) => {
  const session: any = await getSession();
  session.id = id;
  await session.save();
};

export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}

export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24; // 1 day
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);
  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff, "days");
}

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}
