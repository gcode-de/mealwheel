import styled from "styled-components";

import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Styled/MealCard";
import Header from "@/components/Styled/Header";
import IconButton from "@/components/Styled/IconButton";
import { useRouter } from "next/router";
import StyledH2 from "@/components/Styled/StyledH2";
import Spacer from "@/components/Styled/Spacer";

export default function HasCooked({
  user,
  error,
  isLoading,
  getRecipeProperty,
  toggleHasCooked,
}) {
  const router = useRouter();
  const favoriteRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.hasCooked)
    .map((recipe) => recipe.recipe);

  if (error) {
    <div>
      <Header text={"schon gekocht 🥗"} />
      Error...
    </div>;
  }

  if (isLoading) {
    return (
      <>
        <Header text="schon gekocht 🥗" />
        <StyledArticle>
          <StyledUl>
            <h2>Lade Rezepte...</h2>
            <CardSkeleton amount={5} $isLoading />
          </StyledUl>
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
      <StyledH2>schon gekocht</StyledH2>
      <StyledArticle>
        <StyledUl>
          {favoriteRecipes?.map((recipe) => {
            return (
              <>
                <MealCard
                  key={recipe._id}
                  recipe={recipe}
                  isFavorite={getRecipeProperty(recipe._id, "hasCooked")}
                  onToggleIsFavorite={toggleHasCooked}
                ></MealCard>
                {/* <IconButton style="Pot" /> */}
              </>
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
