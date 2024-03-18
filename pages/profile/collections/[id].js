import Header from "@/components/Styled/Header";
import IconButton from "@/components/Styled/IconButton";
import MealCard from "@/components/Styled/MealCard";
import { useRouter } from "next/router";
import StyledUl from "@/components/StyledUl";

export default function DetailCollection({ recipes, user }) {
  const router = useRouter();
  const { id } = router.query;
  if (!user) {
    return;
  }

  const foundCollection = user.collections.find((col) => col._id === id);

  const foundRecipes = recipes.filter((recipe) =>
    foundCollection.recipes.includes(recipe._id)
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
      <StyledUl>
        {foundRecipes.map((recipe) => (
          <MealCard key={recipe} recipe={recipe} />
        ))}
      </StyledUl>
    </>
  );
}
