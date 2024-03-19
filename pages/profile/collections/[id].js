import IconButton from "@/components/Styled/IconButton";
import MealCard from "@/components/MealCard";
import { useRouter } from "next/router";
import StyledUl from "@/components/StyledUl";
import Spacer from "@/components/Styled/Spacer";
import StyledH2 from "@/components/Styled/StyledH2";

export default function DetailCollection({ recipes, user }) {
  const router = useRouter();
  const { id } = router.query;
  if (!user || !recipes) {
    return;
  }

  const foundCollection = user.collections.find((col) => col._id === id);

  return (
    <>
      <Spacer />
      <StyledH2>{foundCollection.collectionName} </StyledH2>
      <IconButton
        onClick={() => router.back()}
        left="var(--gap-out)"
        top="var(--gap-out)"
        style="ArrowLeft"
      />
      <StyledUl>
        {foundCollection.recipes.map((recipe) => (
          <MealCard key={recipe._id} recipe={recipe} />
        ))}
      </StyledUl>
    </>
  );
}