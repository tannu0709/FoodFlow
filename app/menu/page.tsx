"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

type User = {
  userId: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function MenuPage() {
  const router = useRouter();

  const [foods, setFoods] = useState<Food[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // ----------------------------------------
  // Get foods
  // ----------------------------------------

  useEffect(() => {
    async function getFoods() {
      try {
        const res = await fetch("/api/foods");

        if (!res.ok) {
          console.error("Failed to fetch foods");
          return;
        }

        const data = (await res.json()) as {
          foods: Food[];
        };

        setFoods(data.foods || []);
      } catch (error) {
        console.error("Get foods error:", error);
      }
    }

    getFoods();
  }, []);

  // ----------------------------------------
  // Get logged-in user
  // ----------------------------------------

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();

        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Get current user error:", error);

        setUser(null);
      }
    }

    getCurrentUser();
  }, []);

  // ----------------------------------------
  // Add food to cart
  // ----------------------------------------

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

    // ----------------------------------------
    // IMPORTANT:
    // After adding food, go directly to checkout
    // ----------------------------------------

    router.push("/checkout");
  }

  // ----------------------------------------
  // Delete food
  // ----------------------------------------

  async function deleteFood(foodId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/foods/${foodId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete food");
        return;
      }

      // Remove deleted food from UI
      setFoods((currentFoods) =>
        currentFoods.filter((food) => food._id !== foodId),
      );

      alert("Food deleted successfully");
    } catch (error) {
      console.error("Delete food error:", error);

      alert("Something went wrong while deleting food");
    }
  }

  // ----------------------------------------
  // Check admin
  // ----------------------------------------

  const isAdmin = user?.role === "admin";

  return (
    <main className="max-w-6xl mx-auto p-10">
      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Our Menu</h1>

        {/* Admin only */}
        {isAdmin && (
          <button
            onClick={() => router.push("/admin/foods/new")}
            className="bg-black text-white px-5 py-3 rounded"
          >
            + Add Food
          </button>
        )}
      </div>

      {/* -------------------------------- */}
      {/* Food Grid */}
      {/* -------------------------------- */}

      {foods.length === 0 ? (
        <p className="text-gray-500">No food available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food: Food) => (
            <div key={food._id} className="border rounded-lg p-5">
              {/* Food information */}

              <h2 className="font-bold text-xl">{food.name}</h2>

              <p className="mt-2 text-gray-600">{food.description}</p>

              <p className="font-bold mt-3">₹ {food.price}</p>

              {/* -------------------------------- */}
              {/* Customer controls */}
              {/* -------------------------------- */}

              {!isAdmin && (
                <button
                  onClick={() => addToCart(food)}
                  className="mt-4 bg-black text-white px-4 py-2 rounded"
                >
                  Add to Cart
                </button>
              )}

              {/* -------------------------------- */}
              {/* Admin controls */}
              {/* -------------------------------- */}

              {isAdmin && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => router.push(`/admin/foods/edit/${food._id}`)}
                    className="border border-black px-4 py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteFood(food._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
