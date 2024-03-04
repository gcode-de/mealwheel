import styled from "styled-components";
import useSWR from "swr";
import Header from "@/components/Styled/Header";
import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Styled/MealCard";

export default function HomePage({
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
}) {
  const {
    data: recipes,
    error: recipesError,
    isLoading: recipesIsLoading,
  } = useSWR(`/api/recipes`);

  if (recipesError || error) {
    return (
      <div>
        <Header text={"Meal Wheel 🥗"} />
        {error}
      </div>
    );
  }

  if (recipesIsLoading || isLoading) {
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

  return (
    <>
      <Header text={"Meal Wheel 🥗"} />
      <article>
        <StyledUl>
          {recipes?.map((recipe) => {
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
