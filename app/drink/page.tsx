"use client";

import React, { useEffect, useState } from "react";
import { fetchDrinks } from "./action";

interface Drink {
  id: number;
  title: string;
  price: number;
  productCode: string;
}

const DrinkPage = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);

  useEffect(() => {
    async function loadDrinks() {
      try {
        const drinksData = await fetchDrinks();
        setDrinks(drinksData);
      } catch (error) {
        console.error("물품을 불러오는 데 실패했습니다", error);
      }
    }
    loadDrinks();
  }, []);

  const handleSelectDrink = (drink: Drink) => {
    const currentForm = localStorage.getItem("orderForm");
    const parsedForm = currentForm ? JSON.parse(currentForm) : { items: [] };
    parsedForm.items[0].title = drink.title;
    parsedForm.items[0].price = drink.price;
    localStorage.setItem("orderForm", JSON.stringify(parsedForm));
    window.location.href = "/order/add";
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl mb-4">주류</h2>
      <ul className="border p-2">
        {drinks.map((drink) => (
          <li key={drink.id} onClick={() => handleSelectDrink(drink)} className="cursor-pointer hover:bg-gray-200 p-2">
            {drink.title} - ${drink.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrinkPage;
