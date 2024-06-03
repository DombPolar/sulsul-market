"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "./schema";

const AddProduct = () => {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema),
  });
  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!file) return;
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      return alert("이미지 업로드에 실패했습니다.");
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price + "");
    formData.append("photo", data.photo);
    const errors = await uploadProduct(formData);
    if (errors) {
      if (errors.fieldErrors.photo) {
        setError("photo", { message: errors.fieldErrors.photo[0] });
      }
      if (errors.fieldErrors.title) {
        setError("title", { message: errors.fieldErrors.title[0] });
      }
      if (errors.fieldErrors.price) {
        setError("price", { message: errors.fieldErrors.price[0] });
      }
      if (errors.fieldErrors.description) {
        setError("description", { message: errors.fieldErrors.description[0] });
      }
    }
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    if (files.length !== 1) return alert("파일은 한개만 업로드해야 합니다.");
    const MB = 1024 * 1024; // 1 MB
    if (files[0].size > 5 * MB) return alert("파일은 최대 5MB입니다.");
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    const response = await getUploadUrl();
    console.log(response);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/KqZxDrhOWGq2ozBEZgX2Zw/${id}`
      );
    }
  };
  const onValid = async () => {
    await onSubmit();
  };
  return (
    <div>
      <form action={onValid} className="p-5 flex flex-col gap-3">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex flex-col items-center justify-center gap-3 text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="size-20" />
              <div className="text-sm text-neutral-400">
                사진을 추가해 주세요.
              </div>
            </>
          ) : null}
        </label>
        {
          <span className="text-red-500 font-medium">
            {errors.photo?.message}
          </span>
        }
        <input
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          accept="image/*"
          onChange={onImageChange}
        />
        <Input
          required
          placeholder="제목"
          type="text"
          errors={[errors.title?.message ?? ""]}
          {...register("title")}
        />
        <Input
          required
          placeholder="가격"
          type="number"
          errors={[errors.price?.message ?? ""]}
          {...register("price")}
        />
        <Input
          required
          placeholder="자세한 설명"
          type="text"
          errors={[errors.description?.message ?? ""]}
          {...register("description")}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
};

export default AddProduct;
