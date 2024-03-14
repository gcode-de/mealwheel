import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { notifySuccess, notifyError } from "/helpers/toast";

export default function EditRecipe() {
  const router = useRouter();
  const { id } = router.query;
  const { data: recipe, isLoading } = useSWR(`/api/recipes/${id}`);

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
      return true;
    }
    return false;
  }

  if (isLoading) {
    return <div>is Loading...</div>;
  }

  return (
    <RecipeForm
      onSubmit={() =>
        handleEdit()
          ? notifySuccess("Rezept geändert")
          : notifyError("Rezept konnte nicht geändert werden")
      }
      data={recipe}
      onDelete={() =>
        handleDelete()
          ? notifySuccess("Rezept gelöscht")
          : notifyError("Rezept konnte nicht gelöscht werden")
      }
    />
  );
}
