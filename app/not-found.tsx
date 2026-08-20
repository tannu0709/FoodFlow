import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>

        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>

        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="bg-black text-white px-6 py-3 rounded-lg inline-block"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
