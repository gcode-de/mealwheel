import styled from "styled-components";
import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Styled/MealCard";
import Header from "@/components/Styled/Header";

export default function Favorites({
  user,
  error,
  isLoading,
  getRecipeProperty,
}) {
  const favoriteRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.isFavorite)
    .map((recipe) => recipe.recipe);

  if (error) {
    return <div>error</div>;
  }

  if (isLoading) {
    return (
      <>
        User:
        <Header text="Bookmarked 🥗" />
        <StyledArticle>
          <StyledUl>
            Loading Recipes...
            <CardSkeleton amount={5} $isLoading />
          </StyledUl>
        </StyledArticle>
      </>
    );
  }

  return (
    <>
      <Header text="Bookmarked 🥗" />
      <StyledArticle>
        <StyledUl>
          {favoriteRecipes?.map((recipe) => {
            return (
              <MealCard
                key={recipe._id}
                recipe={recipe}
                isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
              />
            );
          })}
        </StyledUl>
      </StyledArticle>
    </>
  );
}

const StyledArticle = styled.article``;

const StyledUl = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
`;
