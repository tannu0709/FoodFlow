import FoodForm from "@/components/FoodForm";
import FoodList from "@/components/FoodList";

export default function FoodPage() {
  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">Food Management</h1>

      <FoodForm />

      <FoodList />
    </main>
  );
}
