import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import React, { useState } from "react";
import NextProgress from "nextjs-progressbar";
import Image from "next/image";

export default function AddRecipe() {
  const [imageUrl, setImageUrl] = useState("");
  const { mutate } = useSWR("/api/recipes");
  const router = useRouter();

  const uploadImage = async (e) => {
    const files = e.target.files;
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
    <>
      <div>
        <NextProgress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
        />
        {imageUrl && (
          <Image src={imageUrl} alt="Uploaded Image" width={300} height={250} />
        )}
        <input type="file" onChange={uploadImage} />
      </div>
      <RecipeForm onSubmit={addRecipe} formName={"add-recipe"}></RecipeForm>
    </>
  );
}
