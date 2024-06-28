"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import React from "react";
import { uploadPost } from "./action";  // 여기서 action.ts 파일에서 함수가 제대로 가져와집니다.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostType, postSchema } from "./schema";

const AddPost = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PostType>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = handleSubmit(async (data: PostType) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) {
      formData.append("description", data.description);
    }

    const errors = await uploadPost(formData);
    if (errors) {
      if (errors.fieldErrors.title) {
        setError("title", { message: errors.fieldErrors.title[0] });
      }
      if (errors.fieldErrors.description) {
        setError("description", { message: errors.fieldErrors.description[0] });
      }
    }
  });

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-5 flex flex-col">
            <h1 className="text-4xl mb-3">공지사항 작성🖊️</h1>
      <form onSubmit={onSubmit} className="p-5 flex flex-col gap-3">
        <Input
          required
          placeholder="제목"
          type="text"
          errors={[errors.title?.message ?? ""]}
          {...register("title")}
        />
        <Input
          placeholder="내용"
          type="text"
          errors={[errors.description?.message ?? ""]}
          {...register("description")}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
};

export default AddPost;
