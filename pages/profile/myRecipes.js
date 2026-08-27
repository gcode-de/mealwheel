import MealCard from "@/components/Cards/MealCard";
import IconButton from "@/components/Button/IconButton";
import { useState } from "react";
import IconButtonLarge from "@/components/Button/IconButtonLarge";
import { Spacer, H2 } from "@/components/Styled/Styled";
import styled from "styled-components";
import { useRouter } from "next/router";
import { PageError, PageLoading } from "@/components/PageState";

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
  const router = useRouter();
  function toggleAddCollection() {
    setIsModalCollection(!isModalCollection);
  }

  if (error || recipesError) {
    return (
      <PageError
        title="Meine Rezepte"
        message="Deine Rezepte konnten nicht geladen werden."
        onRetry={() => Promise.all([mutateUser?.(), mutateRecipes()])}
      />
    );
  }

  if (isLoading || recipesIsLoading) {
    return <PageLoading title="Meine Rezepte" amount />;
  }

  const myRecipes = (recipes || []).filter(
    (recipe) => recipe.author === user?._id
  );

  return (
    <>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      <Spacer />
      <H2>Meine Rezepte</H2>

      <StyledUl>
        {myRecipes.length
          ? myRecipes.map((recipe) => {
              return (
                <MealCard
                  key={recipe._id}
                  recipe={recipe}
                  $isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
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
