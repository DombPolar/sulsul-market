import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

async function getInitialProducts() {
  const products = await db.product.findMany({
    where: {
      isSold: false,
    },
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: "Home",
};

const ProductsPage = async () => {
  const initialProducts = await getInitialProducts();
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-5">
      <h1 className="text-4xl mb-3">반품 & 건의🖨️</h1>
      <div>
        <ProductList initialProduct={initialProducts} />
      </div>
      <Link
        href="/home/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 left-0 right-0 mx-auto translate-x-36 sm:translate-x-44 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
};

export default ProductsPage;
