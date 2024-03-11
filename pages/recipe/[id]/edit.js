import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function EditRecipe() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useSWR(`/api/recipes/${id}`);

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

  return <RecipeForm onSubmit={handleEdit} data={data} />;
}
