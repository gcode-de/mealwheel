import styled from "styled-components";

import MealCard from "@/components/Cards/MealCard";
import Header from "@/components/Styled/Header";
import IconButton from "@/components/Styled/IconButton";
import { useRouter } from "next/router";
import StyledH2 from "@/components/Styled/StyledH2";
import Spacer from "@/components/Styled/Spacer";
import LoadingComponent from "@/components/Loading";

export default function HasCooked({
  user,
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
  mutateUser,
}) {
  const router = useRouter();
  const hasCookedRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.hasCooked)
    .map((recipe) => recipe.recipe);

  if (error) {
    <div>
      <Header text={"Schon gekocht"} />
      Error...
    </div>;
  }

  if (isLoading) {
    return (
      <>
        <Header text="Schon gekocht" />
        <LoadingComponent amount />
      </>
    );
  }

  if (!hasCookedRecipes.length) {
    return (
      <>
        <IconButton
          style="ArrowLeft"
          top="var(--gap-out)"
          left="var(--gap-out)"
          onClick={() => router.back()}
        />
        <Spacer />
        <Header text="Schon gekocht" />
        <StyledArticle>
          <StyledUl>{`Du hast noch keine Rezepte als "gekocht" markiert.`}</StyledUl>
        </StyledArticle>
      </>
    );
  }

  return (
    <>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      <Spacer />
      <StyledH2>Schon gekocht</StyledH2>
      <StyledArticle>
        <StyledUl>
          {hasCookedRecipes?.map((recipe) => {
            return (
              <MealCard
                key={recipe._id}
                recipe={recipe}
                isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
                onToggleIsFavorite={() => {
                  toggleIsFavorite(recipe._id, mutateUser);
                }}
              ></MealCard>
            );
          })}
        </StyledUl>
      </StyledArticle>
    </>
  );
}

const StyledArticle = styled.article``;

const StyledUl = styled.ul`
  padding: 10px;
  max-width: 350px;
  margin: 0 auto;
`;
