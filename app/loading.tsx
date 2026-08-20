export default function Loading() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />

        <p className="text-gray-600">Loading...</p>
      </div>
    </main>
  );
}
