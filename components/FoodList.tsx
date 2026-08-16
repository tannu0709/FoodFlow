"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Food {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
}

export default function FoodList() {
  const [foods, setFoods] = useState<Food[]>([]);

  const [loading, setLoading] = useState(true);

  async function fetchFoods() {
    try {
      const res = await fetch("/api/foods");

      const data = await res.json();

      setFoods(data.foods);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFoods();
  }, []);

  async function deleteFood(id: string) {
    const confirmDelete = confirm("Are you sure you want to delete this food?");

    if (!confirmDelete) return;

    const res = await fetch(`/api/foods/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Food Deleted Successfully");

      fetchFoods();
    } else {
      alert("Delete Failed");
    }
  }

  if (loading) {
    return <div className="mt-10">Loading Foods...</div>;
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-5">Food List</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">Name</th>

            <th className="border p-3">Category</th>

            <th className="border p-3">Price</th>

            <th className="border p-3">Available</th>

            <th className="border p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {foods.map((food) => (
            <tr key={food._id}>
              <td className="border p-3">{food.name}</td>

              <td className="border p-3">{food.category}</td>

              <td className="border p-3">₹{food.price}</td>

              <td className="border p-3">{food.available ? "Yes" : "No"}</td>

              <td className="border p-3 space-x-2">
                <Link
                  href={`/admin/foods/edit/${food._id}`}
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteFood(food._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
