"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        alert("Logout failed");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      alert("Something went wrong");
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="border px-4 py-2 rounded hover:bg-gray-100"
    >
      Logout
    </button>
  );
}
