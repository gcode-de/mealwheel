import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/router";

export default function EditRecipe() {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  return <RecipeForm />;
}
