import styled from "styled-components";
import useSWR from "swr";
import Header from "@/components/Styled/Header";
import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Styled/MealCard";

export default function HomePage({ userId }) {
  const {
    data,
    error: recipesError,
    isLoading: recipesIsLoading,
  } = useSWR(`/api/recipes`);
  const {
    data: user,
    error: userError,
    isLoading: userIsLoading,
  } = useSWR(`/api/users/${userId}`);

  function getRecipeProperty(_id, property) {
    const recipeInteraction = user.recipeInteractions.find(
      (interaction) => interaction.recipe._id === _id
    );
    return recipeInteraction?.[property];
  }

  if (recipesError || userError) {
    return (
      <div>
        <Header text={"Meal Wheel 🥗"} />
        error
      </div>
    );
  }

  if (recipesIsLoading || userIsLoading) {
    return (
      <>
        <Header text={"Meal Wheel 🥗"} />
        <article>
          <StyledUl>
            Loading recipes...
            <CardSkeleton amount={5} $isLoading />
          </StyledUl>
        </article>
      </>
    );
  }

  const favoriteRecipes = user?.recipeInteractions.filter(
    (recipe) => recipe.isFavorite
  );

  return (
    <>
      <Header text={"Meal Wheel 🥗"} />
      <article>
        <StyledUl>
          {data?.map((recipe) => {
            // const recipeInteraction = favoriteRecipes.find(
            //   (r) => r.recipe._id === recipe._id
            // );
            // console.log(recipeInteraction);
            // const isFavorite = recipeInteraction?.isFavorite;
            // console.log(isFavorite);

            return (
              <MealCard
                key={recipe._id}
                recipe={recipe}
                isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
              />
            );
          })}
        </StyledUl>
      </article>
    </>
  );
}

const StyledUl = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
`;
