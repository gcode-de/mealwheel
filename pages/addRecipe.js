import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function AddRecipe() {
  const { mutate } = useSWR("/api/recipes");
  const router = useRouter();

  async function addRecipe(recipe) {
    // try {
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      console.error(response.status);
      return;
    }
    mutate();
    router.back();
    // } catch (error) {
    //   console.error("Fehler beim Hinzufügen des Rezepts:", error);
    // }
  }
  return <RecipeForm onSubmit={addRecipe} formName={"add-recipe"}></RecipeForm>;
}
