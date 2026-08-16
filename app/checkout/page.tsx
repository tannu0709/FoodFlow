"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    try {
      const savedCart = window.localStorage.getItem("cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error("Failed to read cart:", error);
    }
  }, []);

  // Save cart to localStorage
  function saveCart(updatedCart: CartItem[]) {
    setCart(updatedCart);

    window.localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  // Increase quantity
  function increaseQuantity(id: string) {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item,
    );

    saveCart(updatedCart);
  }

  // Decrease quantity
  function decreaseQuantity(id: string) {
    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  }

  // Remove item completely
  function removeItem(id: string) {
    const updatedCart = cart.filter((item) => item._id !== id);

    saveCart(updatedCart);
  }

  async function placeOrder() {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your delivery address");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          deliveryAddress: address.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to place order");
        return;
      }

      window.localStorage.removeItem("cart");

      alert("Order placed successfully!");

      router.push("/orders");
    } catch (error) {
      console.error("Place order error:", error);

      alert("Something went wrong while placing the order");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="border rounded-lg p-6">
          <p>Loading checkout...</p>
        </div>
      </main>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

        {cart.length === 0 ? (
          <div>
            <p className="mb-4">Your cart is empty.</p>

            <button
              onClick={() => router.push("/menu")}
              className="bg-black text-white px-5 py-2 rounded"
            >
              Go to Menu
            </button>
          </div>
        ) : (
          <>
            {/* CART ITEMS */}
            <div className="space-y-5">
              {cart.map((item) => (
                <div key={item._id} className="border-b pb-5">
                  <div className="flex justify-between items-center">
                    {/* Food name and price */}
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>

                      <p className="text-gray-600">₹{item.price} each</p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item._id)}
                        className="w-9 h-9 border rounded flex items-center justify-center text-xl hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="font-semibold min-w-[25px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item._id)}
                        className="w-9 h-9 border rounded flex items-center justify-center text-xl hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item total + remove */}
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="text-xl font-bold mt-6 border-t pt-5">
              Total: ₹{total}
            </div>

            {/* ADDRESS */}
            <div className="mt-8">
              <label htmlFor="address" className="block font-medium mb-2">
                Delivery Address
              </label>

              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border rounded w-full p-3"
                rows={4}
                placeholder="Enter your delivery address"
              />
            </div>

            {/* PLACE ORDER */}
            <button
              onClick={placeOrder}
              disabled={loading}
              className="mt-5 bg-black text-white px-6 py-3 rounded disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
