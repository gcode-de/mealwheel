import Header from "@/components/Styled/Header";
import IconButton from "@/components/Styled/IconButton";
import MealCard from "@/components/Styled/MealCard";
import { useRouter } from "next/router";

export default function DetailCollection({ recipes, user }) {
  if (!user) {
    return;
  }
  const router = useRouter();
  const { id } = router.query;

  const foundCollection = user.collection.find((col) => col._id === id);
  console.log(foundCollection.recipes);

  const foundRecipes = recipes.filter((recipe) =>
    foundCollection.includes(recipe._id)
  );

  //such das passende rezept mir den ids aus user.collection.recipes, erstelle ein neues array mit den passenden rezepten

  return (
    <>
      <Header text={foundCollection.collectionName} />
      <IconButton
        onClick={() => router.back()}
        left="var(--gap-out)"
        style="ArrowLeft"
      />
      {/* {recipes.map((recipe) => (
        <MealCard key={recipe} recipe={recipe} />
      ))} */}
    </>
  );
}
