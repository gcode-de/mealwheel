import RecipeForm from "@/components/RecipeForm";
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
      return false;
    }
    await mutate();
    router.back();
    return true;
  }

  return (
    <RecipeForm
      onSubmit={() =>
        addRecipe()
          ? notifySuccess("Rezept hinzugefügt")
          : notifyError("Rezept konnte nicht hinzugefügt werden")
      }
      formName={"add-recipe"}
    />
  );
}
