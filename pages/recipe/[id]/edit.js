import { useRouter } from "next/router";
import useSWR from "swr";
import { notifySuccess, notifyError } from "/helpers/toast";

import RecipeForm from "@/components/Forms/RecipeForm";
import { PageError, PageLoading } from "@/components/PageState";
import handleDeleteImage from "@/helpers/Cloudinary/handleDeleteImage";

export default function EditRecipe({ user }) {
  const router = useRouter();
  const { id } = router.query;
  const { data: recipe, error, isLoading, mutate } = useSWR(
    id ? `/api/recipes/${id}` : null
  );

  async function handleDelete() {
    if (recipe.publicId) {
      handleDeleteImage(recipe.publicId);
    }
    const response = await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user._id, author: recipe.author }),
    });

    if (response.ok) {
      router.push("/");
      notifySuccess("Rezept gelöscht");
    } else {
      console.error("Löschen fehlgeschlagen", response.body);
      notifyError("Rezept konnte nicht gelöscht werden");
    }
  }

  async function handleEdit(data) {
    const response = await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.back();
      notifySuccess("Rezept geändert");
      mutate();
    } else {
      notifyError("Rezept konnte nicht geändert werden");
    }
  }

  if (error) {
    return (
      <PageError
        title="Rezept bearbeiten"
        message="Das Rezept konnte nicht geladen werden."
        onRetry={() => mutate()}
      />
    );
  }

  if (isLoading) {
    return <PageLoading title="Rezept bearbeiten" />;
  }

  return (
    <RecipeForm
      onSubmit={handleEdit}
      data={recipe}
      formName="editRecipe"
      onDelete={handleDelete}
    />
  );
}
