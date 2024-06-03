"use client";

import { onDelete } from "./actins";
import { useState } from "react";

const DeleteButton = ({ id, isOwner }: { id: number; isOwner: boolean }) => {
  const [isLoading, setLoading] = useState(false);
  const onClick = async () => {
    const ok = window.confirm("상품을 삭제하시겠습니까?");
    if (!ok) return;
    setLoading(true);
    await onDelete(id, isOwner);
    setLoading(false);
    window.location.href = "/home";
  };
  return (
    <button
      onClick={onClick}
      type="button"
      className="bg-red-500 w-full h-10 rounded-md text-white font-semibold"
    >
      {isLoading ? "삭제하는 중.." : "삭제하기"}
    </button>
  );
};

export default DeleteButton;
