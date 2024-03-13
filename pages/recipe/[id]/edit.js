import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function EditRecipe({ user }) {
  const router = useRouter();
  const { id } = router.query;
  const { data: recipe, isLoading } = useSWR(`/api/recipes/${id}`);

  async function handleDelete() {
    if (confirm("Dieses Rezept löschen?") !== true) {
      return;
    }
    const response = await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user._id, author: recipe.author }),
    });

    if (response.ok) {
      router.back();
    } else {
      console.log("Löschen fehlgeschlagen", response.body);
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
    }
  }

  if (isLoading) {
    return <div>is Loading...</div>;
  }

  return (
    <RecipeForm onSubmit={handleEdit} onDelete={handleDelete} data={recipe} />
  );
}
