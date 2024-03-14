import RecipeForm from "@/components/Forms/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import React from "react";
import { notifySuccess, notifyError } from "/helpers/toast";

export default function AddRecipe({ user }) {
  const { mutate } = useSWR("/api/recipes");
  const router = useRouter();

  async function addRecipe(recipe) {
    const newRecipe = { ...recipe, author: user._id };
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    });
    if (!response.ok) {
      console.error(response.status);
      notifyError("Rezept konnte nicht hinzugefügt werden");
    }
    await mutate();
    router.back();
    notifySuccess("Rezept hinzugefügt");
  }

  return <RecipeForm onSubmit={addRecipe} formName="addRecipe" />;
}
