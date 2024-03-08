import styled from "styled-components";

import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Styled/MealCard";
import Header from "@/components/Styled/Header";
import IconButton from "@/components/Styled/IconButton";

export default function hasCooked({
  user,
  error,
  isLoading,
  getRecipeProperty,
  toggleHasCooked,
}) {
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
      <Header text="schon gekocht 🥗" />
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
