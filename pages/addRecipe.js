import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import React, { useState } from "react";

export default function AddRecipe() {
  const [imageUrl, setImageUrl] = useState("");
  const { mutate } = useSWR("/api/recipes");
  const router = useRouter();

  const uploadImage = async (event) => {
    const files = event.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "meal_wheel");
    const uploadResponse = await fetch(
      "https://api.cloudinary.com/v1_1/mealwheel/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await uploadResponse.json();
    setImageUrl(file.secure_url);
  };

  async function addRecipe(recipe) {
    const newRecipe = { ...recipe, imageLink: imageUrl };
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

  return (
    <RecipeForm
      onChange={uploadImage}
      onSubmit={addRecipe}
      formName={"add-recipe"}
      imageUrl={imageUrl}
    ></RecipeForm>
  );
}
