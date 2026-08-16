"use client";

import { useEffect, useState } from "react";

type Food = {
  _id: string;
  name: string;
  description?: string;
  price: number;
};

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function MenuPage() {
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    async function getFoods() {
      const res = await fetch("/api/foods");

      const data = (await res.json()) as { foods: Food[] };

      setFoods(data.foods);
    }

    getFoods();
  }, []);

  function addToCart(food: Food) {
    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]",
    ) as CartItem[];

    const existingItem = existingCart.find((item) => item._id === food._id);

    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item._id === food._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          _id: food._id,
          name: food.name,
          price: food.price,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    alert(`${food.name} added to cart`);
  }

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">Our Menu</h1>

      <div className="grid grid-cols-3 gap-6">
        {foods.map((food: Food) => (
          <div key={food._id} className="border rounded-lg p-5">
            <h2 className="font-bold text-xl">{food.name}</h2>

            <p>{food.description}</p>

            <p className="font-bold mt-2">₹ {food.price}</p>

            <button
              onClick={() => addToCart(food)}
              className="mt-3 bg-black text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
