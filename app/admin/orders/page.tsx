"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  name?: string;
  email?: string;
}

interface Order {
  _id: string;
  userId: Customer | null;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "Pending"
    | "Preparing"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  deliveryAddress: string;
  createdAt: string;
}

const statuses = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchOrders() {
    try {
      setLoading(true);

      const response = await fetch("/api/orders/admin");

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load orders");
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);

      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders();
    };
    loadOrders();
  }, []);

  async function updateStatus(orderId: string, status: string) {
    try {
      setUpdatingId(orderId);

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update order");
        return;
      }

      // Update UI without reloading page
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order,
        ),
      );

      alert("Order status updated successfully");
    } catch (error) {
      console.error("Update status error:", error);

      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Manage Orders</h1>

        <p>Loading orders...</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Orders</h1>

        <button
          onClick={fetchOrders}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-6 shadow-sm">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    Order #{order._id.slice(-6)}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Customer:{" "}
                    {order.userId?.name || order.userId?.email || "Unknown"}
                  </p>

                  {order.userId?.email && (
                    <p className="text-sm text-gray-500">
                      {order.userId.email}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor={`status-${order._id}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Order Status
                  </label>

                  <select
                    id={`status-${order._id}`}
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded px-3 py-2"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="mt-5 border-t pt-5">
                <h3 className="font-semibold mb-3">Items</h3>

                <div className="space-y-2">
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
              </div>

              {/* Order information */}
              <div className="border-t mt-5 pt-5">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>

                  <span className="font-bold">₹{order.totalAmount}</span>
                </div>

                <div className="mt-3">
                  <span className="font-medium">Delivery Address</span>

                  <p className="text-gray-600 mt-1">{order.deliveryAddress}</p>
                </div>

                <div className="mt-3 text-sm text-gray-500">
                  Ordered on: {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
