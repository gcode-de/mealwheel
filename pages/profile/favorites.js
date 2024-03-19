import styled from "styled-components";
import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/MealCard";
import Header from "@/components/Styled/Header";
import StyledUl from "@/components/StyledUl";
import LoadingComponent from "@/components/Loading";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Favorites({
  user,
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
}) {
  const { data: session, status } = useSession();
  if (!user) {
    return (
      <>
        <Header text="Favoriten 🥗" />
        <StyledArticle>
          <StyledUl>
            Bitte <Link href="/api/auth/signin">einloggen</Link>, um Favoriten
            zu speichern.
          </StyledUl>
        </StyledArticle>
      </>
    );
  }

  const favoriteRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.isFavorite)
    .map((recipe) => recipe.recipe);

  if (error) {
    <div>
      <Header text={"Favoriten 🥗"} />
      Error...
    </div>;
  }

  if (isLoading || status === "loading") {
    return (
      <>
        <Header text="Favoriten 🥗" />
        <LoadingComponent amount />
      </>
    );
  }

  if (!favoriteRecipes.length) {
    return (
      <>
        <Header text="Favoriten 🥗" />
        <StyledArticle>
          <StyledUl>Du hast noch keine Favoriten gespeichert.</StyledUl>
        </StyledArticle>
      </>
    );
  }

  return (
    <>
      <Header text="Favoriten 🥗" />
      <StyledArticle>
        <StyledUl>
          {favoriteRecipes?.map((recipe) => {
            return (
              <MealCard
                key={recipe._id}
                recipe={recipe}
                isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
                onToggleIsFavorite={toggleIsFavorite}
              />
            );
          })}
        </StyledUl>
      </StyledArticle>
    </>
  );
}

const StyledArticle = styled.article``;
