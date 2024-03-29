import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Cards/MealCard";
import Header from "@/components/Styled/Header";
import IconButton from "@/components/Styled/IconButton";
import Spacer from "@/components/Styled/Spacer";
import { useState } from "react";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";

import StyledH2 from "@/components/Styled/StyledH2";

import styled from "styled-components";

export default function MyRecipes({
  user,
  mutateUser,
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
  recipes,
  recipesIsLoading,
  recipesError,
  mutateRecipes,
}) {
  const [isModalCollection, setIsModalCollection] = useState(false);

  const myRecipes = recipes?.filter((recipe) => recipe.author === user?._id);

  function toggleAddCollection() {
    setIsModalCollection(!isModalCollection);
  }

  if (error || recipesError || !myRecipes) {
    return (
      <>
        <Header text={"Meine Rezepte"} />
        <StyledUl>Keine eigenen Rezepte vorhanden...</StyledUl>
        <IconButton
          onClick={() => {
            router.back();
          }}
          style={"ArrowLeft"}
          left="2rem"
          top="6rem"
        />
      </>
    );
  }

  if (isLoading || recipesIsLoading) {
    return (
      <>
        <Header text="Meine Rezepte" />

        <StyledUl>
          <h2>Lade Rezepte...</h2>
          <CardSkeleton amount={5} $isLoading />
        </StyledUl>
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
      <StyledH2>Meine Rezepte</StyledH2>

      <StyledUl>
        {myRecipes.length
          ? myRecipes.map((recipe) => {
              return (
                <MealCard
                  key={recipe._id}
                  recipe={recipe}
                  isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
                  onToggleIsFavorite={() => {
                    toggleIsFavorite(recipe._id, mutateUser, mutateRecipes);
                  }}
                ></MealCard>
              );
            })
          : "Du hast noch keine eigenen Rezepte erstellt."}
      </StyledUl>
      <IconButtonLarge
        style={"plus"}
        bottom="5rem"
        onClick={() => router.push("/addRecipe")}
      />
    </>
  );
}

const StyledUl = styled.ul`
  padding: 0;
  max-width: 350px;
  margin: 0 auto;
`;
