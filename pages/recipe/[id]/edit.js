import RecipeForm from "@/components/Forms/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import { notifySuccess, notifyError } from "/helpers/toast";
import LoadingComponent from "@/components/Loading";
import handleDeleteImage from "@/helpers/Cloudinary/handleDeleteImage";

export default function EditRecipe({ user }) {
  const router = useRouter();
  const { id } = router.query;
  const { data: recipe, isLoading, mutate } = useSWR(`/api/recipes/${id}`);

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
      console.log("Löschen fehlgeschlagen", response.body);
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

  if (isLoading) {
    return <LoadingComponent />;
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
