import styled from "styled-components";

import MealCard from "@/components/Cards/MealCard";
import Header from "@/components/Styled/Header";
import IconButton from "@/components/Button/IconButton";
import { useRouter } from "next/router";
import { PageError, PageLoading } from "@/components/PageState";
import { Spacer, H2 } from "@/components/Styled/Styled";

export default function HasCooked({
  user,
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
  mutateUser,
  mutateRecipes,
}) {
  const router = useRouter();
  if (error) {
    return (
      <PageError
        title="Schon gekocht"
        message="Die gekochten Rezepte konnten nicht geladen werden."
        onRetry={() => mutateUser()}
      />
    );
  }

  if (isLoading) {
    return <PageLoading title="Schon gekocht" amount />;
  }

  const hasCookedRecipes = (user?.recipeInteractions || [])
    .filter((recipe) => recipe.hasCooked)
    .map((recipe) => recipe.recipe);

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
        <article>
          <StyledUl>{`Du hast noch keine Rezepte als "gekocht" markiert.`}</StyledUl>
        </article>
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
      <H2>Schon gekocht</H2>
      <article>
        <StyledUl>
          {hasCookedRecipes?.map((recipe) => {
            return (
              <MealCard
                key={recipe._id}
                recipe={recipe}
                $isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
                onToggleIsFavorite={async () => {
                  await toggleIsFavorite(recipe._id, mutateUser, mutateRecipes);
                }}
              ></MealCard>
            );
          })}
        </StyledUl>
      </article>
    </>
  );
}

const StyledUl = styled.ul`
  padding: 10px;
  max-width: 350px;
  margin: 0 auto;
`;
