import RecipeForm from "@/components/Forms/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import { notifySuccess, notifyError } from "/helpers/toast";

export default function EditRecipe({ user }) {
  const router = useRouter();
  const { id } = router.query;
  const { data: recipe, isLoading } = useSWR(`/api/recipes/${id}`);

  async function handleDelete() {
    const response = await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user._id, author: recipe.author }),
    });

    if (response.ok) {
      router.back();
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
    } else {
      notifyError("Rezept konnte nicht geändert werden");
    }
  }

  if (isLoading) {
    return <div>is Loading...</div>;
  }

  return (
    <RecipeForm onSubmit={handleEdit} data={recipe} onDelete={handleDelete} />
  );
}
