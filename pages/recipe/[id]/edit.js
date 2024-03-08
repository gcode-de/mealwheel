import RecipeForm from "@/components/RecipeForm";
import { useRouter } from "next/router";

export default function EditRecipe() {
  const router = useRouter();
  const { ...recipeData } = router.query;

  console.log(recipeData);

  return <RecipeForm value={recipeData} />;
}
