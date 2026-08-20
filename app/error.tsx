"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>

        <p className="text-gray-600 mb-6">
          We could not complete your request. Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
