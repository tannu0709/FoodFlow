"use client";

import { useState } from "react";

export default function FoodForm() {
  const [food, setFood] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/foods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...food,
        price: Number(food.price),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Food Added Successfully!");

      setFood({
        name: "",
        description: "",
        category: "",
        price: "",
        image: "",
      });
    } else {
      alert("Error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-5 rounded">
      <input
        placeholder="Food Name"
        value={food.name}
        onChange={(e) => setFood({ ...food, name: e.target.value })}
        className="border p-2 w-full"
      />

      <input
        placeholder="Description"
        value={food.description}
        onChange={(e) =>
          setFood({
            ...food,
            description: e.target.value,
          })
        }
        className="border p-2 w-full"
      />

      <input
        placeholder="Category"
        value={food.category}
        onChange={(e) =>
          setFood({
            ...food,
            category: e.target.value,
          })
        }
        className="border p-2 w-full"
      />

      <input
        type="number"
        placeholder="Price"
        value={food.price}
        onChange={(e) =>
          setFood({
            ...food,
            price: e.target.value,
          })
        }
        className="border p-2 w-full"
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Add Food
      </button>
    </form>
  );
}
