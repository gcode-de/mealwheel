import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import React, { useState } from "react";

export default function AddRecipe() {
  const { mutate } = useSWR("/api/recipes");
  const router = useRouter();

  async function addRecipe(recipe) {
    const newRecipe = { ...recipe };
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    });
    if (!response.ok) {
      console.error(response.status);
      return;
    }
    mutate();
    router.back();
  }

  return <RecipeForm onSubmit={addRecipe} formName={"add-recipe"} />;
}
