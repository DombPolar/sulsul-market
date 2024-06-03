"use client";

import { InitialProducts } from "@/app/(tabs)/home/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";

interface ProductListProps {
  initialProduct: InitialProducts;
}

const ProductList = ({ initialProduct }: ProductListProps) => {
  const [products, setProducts] = useState(initialProduct);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(5);
  const [isLastPage, setLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (trigger.current && element.isIntersecting) {
          observer.unobserve(trigger.current);
          setLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length === 0) return setLastPage(true);
          setProducts((prev) => [...prev, ...newProducts]);
          setPage((prev) => prev + 1);
          setLoading(false);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -100px 0px" }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);
  return (
    <div className="p-5 flex flex-col gap-5 pb-64">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {/* {!isLastPage && (
        <span ref={trigger} className="opacity-0">
          {isLoading ? "더 불러오는 중.." : "더 불러오기"}
        </span>
      )} */}
    </div>
  );
};

export default ProductList;
