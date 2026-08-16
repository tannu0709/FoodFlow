"use client";

import { useEffect, useState } from "react";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  onCartChange?: (items: CartItem[]) => void;
}

export default function Cart({ onCartChange }: CartProps) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    const savedCart = localStorage.getItem("cart");

    if (!savedCart) return [];

    try {
      return JSON.parse(savedCart) as CartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    onCartChange?.(cart);
  }, [onCartChange, cart]);

  function saveCart(items: CartItem[]) {
    setCart(items);
    localStorage.setItem("cart", JSON.stringify(items));
    onCartChange?.(items);
  }

  function increaseQuantity(id: string) {
    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );

    saveCart(updated);
  }

  function decreaseQuantity(id: string) {
    const updated = cart
      .map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);

    saveCart(updated);
  }

  function removeItem(id: string) {
    const updated = cart.filter((item) => item._id !== id);

    saveCart(updated);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="border rounded-lg p-5">
      <h2 className="text-2xl font-bold mb-5">Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="border-b pb-4">
                <h3 className="font-bold">{item.name}</h3>

                <p>₹{item.price}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="border px-3 py-1"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="border px-3 py-1"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-600 ml-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-5 pt-5">
            <h3 className="text-xl font-bold">Total: ₹{total}</h3>
          </div>
        </>
      )}
    </div>
  );
}
