"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addOrder } from "./action";
import { OrderType, orderSchema } from "./schema";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";

const AddOrder = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<OrderType>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    const savedForm = localStorage.getItem("orderForm");
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      parsedForm.items.forEach((item: any, index: number) => {
        append({ title: item.title, price: item.price, quantity: item.quantity });
      });
    } else {
      append({ title: "", price: 0, quantity: 1 });
    }
  }, [append]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title");
    const price = urlParams.get("price");

    if (title && price && currentIndex !== null) {
      setValue(`items.${currentIndex}.title`, title);
      setValue(`items.${currentIndex}.price`, parseFloat(price));
      setCurrentIndex(null); // Reset the index after setting the value
      localStorage.removeItem("orderForm");
    }
  }, [currentIndex, setValue]);

  const handleNavigateToDrink = (index: number) => {
    setCurrentIndex(index);
    const currentForm = {
      items: fields.map((field) => ({
        title: field.title,
        price: field.price,
        quantity: field.quantity,
      })),
    };
    localStorage.setItem("orderForm", JSON.stringify(currentForm));
    window.location.href = `/drink`;
  };

  const onSubmit = handleSubmit(async (data: OrderType) => {
    const errors = await addOrder(data);
    if (errors && errors.fieldErrors && errors.fieldErrors.items) {
      errors.fieldErrors.items.forEach((itemErrors, index) => {
        if (itemErrors?.title) {
          setError(`items.${index}.title`, { message: itemErrors.title[0] });
        }
        if (itemErrors?.price) {
          setError(`items.${index}.price`, { message: itemErrors.price[0] });
        }
        if (itemErrors?.quantity) {
          setError(`items.${index}.quantity`, { message: itemErrors.quantity[0] });
        }
      });
    } else {
      window.location.href = "/home"; // 홈으로 이동
    }
  });

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      <form onSubmit={onSubmit} className="p-5 flex flex-col gap-3">
      <h1 className="text-4xl mb-3">발주서 작성🖊️</h1>

        {fields.map((item, index) => (
          <div key={item.id} className="flex gap-3 items-center">
            <input
              placeholder="제목"
              type="text"
              {...register(`items.${index}.title`)}
              defaultValue={item.title}
              className="border p-2 w-1/3 bg-white text-black"
            />
            <CheckIcon
              className="ml-2 h-6 w-6 cursor-pointer bg-gray-200 rounded-full"
              onClick={() => handleNavigateToDrink(index)}
            />
            {errors.items && errors.items[index]?.title && (
              <p>{errors.items[index]?.title?.message}</p>
            )}

            <input
              placeholder="가격"
              type="number"
              step="0.01"
              {...register(`items.${index}.price`, {
                valueAsNumber: true,
              })}
              defaultValue={item.price}
              className="border p-2 w-1/3 bg-white text-black"
            />
            {errors.items && errors.items[index]?.price && (
              <p>{errors.items[index]?.price?.message}</p>
            )}

            <input
              placeholder="수량"
              type="number"
              {...register(`items.${index}.quantity`, {
                valueAsNumber: true,
              })}
              defaultValue={item.quantity}
              className="border p-2 w-1/3 bg-white text-black"
            />
            {errors.items && errors.items[index]?.quantity && (
              <p>{errors.items[index]?.quantity?.message}</p>
            )}

            <TrashIcon
              className="ml-2 h-6 w-6 cursor-pointer bg-red-200 rounded-full"
              onClick={() => remove(index)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ title: "", price: 0, quantity: 1 })}
          className="bg-green-500 text-white p-2 rounded mt-2"
        >
          물품 추가
        </button>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
          발주서 제출
        </button>

        <button
          onClick={() => {
            window.location.href = "/live";
          }}
          className="bg-gray-500 text-white p-2 rounded mt-4"
        >
          돌아가기
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
