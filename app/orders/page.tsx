"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/orders");

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load orders");
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);

      setError("Something went wrong while loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders();
    };
    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        <p>Loading orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        <div className="border border-red-300 rounded-lg p-5">
          <p className="text-red-600">{error}</p>

          <button
            onClick={fetchOrders}
            className="mt-4 border px-4 py-2 rounded hover:bg-gray-100"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Orders</h1>

        <button
          onClick={fetchOrders}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="mb-4">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h2 className="font-bold text-lg">
                    Order #{order._id.slice(-6)}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="border rounded-full px-4 py-2 text-sm font-medium">
                  {order.status}
                </div>
              </div>

              {/* Items */}
              <div className="mt-5 space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex justify-between"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total and Address */}
              <div className="border-t mt-5 pt-5">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>

                  <span className="font-bold">₹{order.totalAmount}</span>
                </div>

                <div className="mt-4">
                  <p className="font-medium">Delivery Address</p>

                  <p className="text-gray-600 mt-1">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
