import React from "react";
import EditForm from "@/components/edit-form";
import { getProduct } from "./actions";
import { notFound } from "next/navigation";
import getSession from "@/lib/session";
import { unstable_cache as nextCache } from "next/cache";

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

const EditProduct = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const product = await getCachedProduct(id);
  if (!product) return notFound();
  const session = await getSession();
  const isOwner = session.id === product.userId;
  return (
    <div>
      <EditForm id={id} product={product} isOwner={isOwner} />
    </div>
  );
};

export default EditProduct;
