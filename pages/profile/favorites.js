import styled from "styled-components";
import MealCard from "@/components/Cards/MealCard";
import Header from "@/components/Styled/Header";
import StyledUl from "@/components/Styled/StyledUl";
import { PageError, PageLoading } from "@/components/PageState";

import Link from "next/link";

export default function Favorites({
  user,
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
  mutateUser,
  mutateRecipes,
}) {
  if (isLoading) {
    return <PageLoading title="Favoriten" amount label="Favoriten werden geladen" />;
  }

  if (error) {
    return (
      <PageError
        title="Favoriten"
        message="Deine Favoriten konnten nicht geladen werden."
        onRetry={() => mutateUser()}
      />
    );
  }

  if (!user) {
    return (
      <>
        <Header text="Schmeckos" />
        <StyledArticle>
          <StyledUl>
            Bitte <Link href="/api/auth/signin">einloggen</Link>, um Schmeckos
            zu speichern.
          </StyledUl>
        </StyledArticle>
      </>
    );
  }

  const favoriteRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.isFavorite)
    .map((recipe) => recipe.recipe);

  if (!favoriteRecipes.length) {
    return (
      <>
        <Header text="Meine Schmeckos" />
        <StyledArticle>
          <StyledUl>Du hast noch keine Schmeckos gespeichert.</StyledUl>
        </StyledArticle>
      </>
    );
  }

  return (
    <>
      <Header text="Meine Schmeckos" />
      <StyledArticle>
        <StyledUl>
          {favoriteRecipes?.map((recipe) => {
            return (
              <MealCard
                key={recipe._id}
                recipe={recipe}
                $isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
                onToggleIsFavorite={() => {
                  toggleIsFavorite(recipe._id, mutateUser, mutateRecipes);
                }}
              />
            );
          })}
        </StyledUl>
      </StyledArticle>
    </>
  );
}

const StyledArticle = styled.article``;
