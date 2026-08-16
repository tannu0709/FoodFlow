import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <div className="mt-8">
        <Link
          href="/admin/foods"
          className="rounded bg-black px-6 py-3 text-white"
        >
          Manage Foods
        </Link>
      </div>
    </main>
  );
}
