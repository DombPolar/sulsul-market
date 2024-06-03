import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { formatToTimeAgo } from "../lib/utils";

interface IListProductPromps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
  key: number;
}

const ListProduct = ({
  title,
  price,
  created_at,
  photo,
  id,
}: IListProductPromps) => {
  return (
    <Link href={`/home/${id}`} className="">
      <div className="flex gap-5 items-center">
        <div className="relative size-28 rounded-md overflow-hidden">
          <Image
            fill
            src={`${photo}/avatar`}
            alt={title}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 *:text-white">
          <span className="text-xl">{title}</span>
          <span className="text-lg font-semibold">{formatToWon(price)}원</span>
          <span className="text-sm text-neutral-500">
            {formatToTimeAgo(created_at + "")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ListProduct;
