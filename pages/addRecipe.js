import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import React from "react";
import { notifySuccess, notifyError } from "/helpers/toast";

export default function AddRecipe() {
  const { mutate } = useSWR("/api/recipes");
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading: kindeIsLoading,
    user: kindeUser,
  } = useKindeAuth();

  let {
    data: user,
    isLoading: userIsLoading,
    error: userError,
    mutate: mutateUser,
  } = useSWR(`/api/users/${kindeUser?.id}`);

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
