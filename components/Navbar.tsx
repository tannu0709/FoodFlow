"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  userId: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Get currently logged-in user
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();

        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to get current user:", error);

        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, [pathname]);

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        alert("Logout failed");
        return;
      }

      setUser(null);

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      alert("Something went wrong during logout");
    }
  }

  function isActive(path: string) {
    return pathname === path;
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            FoodFlow
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-5">
            <Link
              href="/menu"
              className={
                isActive("/menu")
                  ? "font-bold"
                  : "text-gray-600 hover:text-black"
              }
            >
              Menu
            </Link>

            {user && (
              <Link
                href="/orders"
                className={
                  isActive("/orders")
                    ? "font-bold"
                    : "text-gray-600 hover:text-black"
                }
              >
                My Orders
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                href="/admin/orders"
                className={
                  pathname.startsWith("/admin")
                    ? "font-bold"
                    : "text-gray-600 hover:text-black"
                }
              >
                Admin
              </Link>
            )}

            {!loading && !user && (
              <>
                <Link
                  href="/login"
                  className={
                    isActive("/login")
                      ? "font-bold"
                      : "text-gray-600 hover:text-black"
                  }
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <span className="text-sm text-gray-600">
                  {user.name || user.email || "User"}
                </span>

                <button
                  onClick={handleLogout}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
