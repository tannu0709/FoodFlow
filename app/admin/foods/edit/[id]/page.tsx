"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Food {
  _id?: string;
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  available: boolean;
}

export default function EditFoodPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [food, setFood] = useState<Food>({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
    available: true,
  });

  useEffect(() => {
    async function loadFood() {
      try {
        const res = await fetch("/api/foods");
        const data = await res.json();

        const selectedFood = data.foods.find(
          (item: Food) => item._id === params.id,
        );

        if (selectedFood) {
          setFood({
            ...selectedFood,
            price: String(selectedFood.price),
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadFood();
  }, [params.id]);

  async function updateFood(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/foods/${params.id}`, {
      method: "PUT",
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
      alert("Food Updated Successfully");
      router.push("/admin/foods");
    } else {
      alert("Something went wrong");
    }
  }

  if (loading) {
    return <main className="p-10 text-center">Loading...</main>;
  }

  return (
    <main className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Edit Food</h1>

      <form onSubmit={updateFood} className="space-y-4">
        <input
          type="text"
          placeholder="Food Name"
          className="border w-full p-3 rounded"
          value={food.name}
          onChange={(e) =>
            setFood({
              ...food,
              name: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          className="border w-full p-3 rounded"
          value={food.description}
          onChange={(e) =>
            setFood({
              ...food,
              description: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Category"
          className="border w-full p-3 rounded"
          value={food.category}
          onChange={(e) =>
            setFood({
              ...food,
              category: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="border w-full p-3 rounded"
          value={food.price}
          onChange={(e) =>
            setFood({
              ...food,
              price: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Image URL"
          className="border w-full p-3 rounded"
          value={food.image}
          onChange={(e) =>
            setFood({
              ...food,
              image: e.target.value,
            })
          }
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={food.available}
            onChange={(e) =>
              setFood({
                ...food,
                available: e.target.checked,
              })
            }
          />
          Available
        </label>

        <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
          Update Food
        </button>
      </form>
    </main>
  );
}
