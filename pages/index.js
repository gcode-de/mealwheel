import useSWR from "swr";
import Header from "@/components/Styled/Header";
import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Styled/MealCard";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";
import { useRouter } from "next/router";
import StyledUl from "@/components/StyledUl";
import ScrollToTop from "@/components/ScrollToTopButton";
import { useState } from "react";
import styled from "styled-components";

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
  const router = useRouter();

  const [isFilterButton, setIsFilterButton] = useState(false);
  const [isDifficultyButton, setIsDifficultyButton] = useState(false);
  const [isDurationButton, setIsDurationButton] = useState(false);
  const [isFoodPreferencesButton, setIsFoodPreferencesButton] = useState(false);

  if (recipesError || error) {
    return (
      <div>
        <Header text={"Meal Wheel 🥗"} />
        Error...
      </div>
    );
  }

  if (recipesIsLoading || isLoading) {
    return (
      <>
        <Header text={"Meal Wheel 🥗"} />
        <article>
          <StyledUl>
            <h2>Lade Rezepte...</h2>
            <CardSkeleton amount={5} $isLoading />
          </StyledUl>
        </article>
      </>
    );
  }

  function toggleFilter() {
    setIsFilterButton(!isFilterButton);
    setIsDifficultyButton(false);
    setIsDurationButton(false);
    setIsFoodPreferencesButton(false);
  }
  function toggleDifficulty() {
    setIsDifficultyButton(!isDifficultyButton);
  }
  function toggleDuration() {
    setIsDurationButton(!isDurationButton);
  }
  function toggleFoodPreferences() {
    setIsFoodPreferencesButton(!isFoodPreferencesButton);
  }

  return (
    <>
      <Header text={"Meal Wheel 🥗"} />
      <StyledFilterButton onClick={toggleFilter}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Layer_1"
          data-name="Layer 1"
          viewBox="0 0 24 24"
          width="30"
          height="30"
        >
          <path d="m4,4.036V.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v3.536c-1.694.243-3,1.704-3,3.464s1.306,3.221,3,3.464v12.536c0,.276.224.5.5.5s.5-.224.5-.5v-12.536c1.694-.243,3-1.704,3-3.464s-1.306-3.221-3-3.464Zm-.5,5.964c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Zm9,3.036V.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12.536c-1.694.243-3,1.704-3,3.464s1.306,3.221,3,3.464v3.536c0,.276.224.5.5.5s.5-.224.5-.5v-3.536c1.694-.243,3-1.704,3-3.464s-1.306-3.221-3-3.464Zm-.5,5.964c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Zm12-11.5c0-1.76-1.306-3.221-3-3.464V.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v3.536c-1.694.243-3,1.704-3,3.464s1.306,3.221,3,3.464v12.536c0,.276.224.5.5.5s.5-.224.5-.5v-12.536c1.694-.243,3-1.704,3-3.464Zm-3.5,2.5c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Z" />
        </svg>
      </StyledFilterButton>
      {isFilterButton && (
        <StyledTopDiv>
          <StyledTopButton onClick={toggleDifficulty}>
            difficulty
          </StyledTopButton>
          <StyledTopButton onClick={toggleDuration}>duration</StyledTopButton>
          <StyledTopButton onClick={toggleFoodPreferences}>
            food preferences
          </StyledTopButton>
        </StyledTopDiv>
      )}
      {isDifficultyButton && (
        <StyledSecondLevelDiv>
          <StyledSecondLevelButton>easy</StyledSecondLevelButton>
          <StyledSecondLevelButton>medium</StyledSecondLevelButton>
          <StyledSecondLevelButton>hard</StyledSecondLevelButton>
        </StyledSecondLevelDiv>
      )}
      {isDurationButton && (
        <StyledSecondLevelDiv>
          <StyledSecondLevelButton> {"< 10"} Min</StyledSecondLevelButton>
          <StyledSecondLevelButton>10 - 20 Min</StyledSecondLevelButton>
          <StyledSecondLevelButton>{"> 20 Min"}</StyledSecondLevelButton>
        </StyledSecondLevelDiv>
      )}
      {isFoodPreferencesButton && (
        <StyledSecondLevelDiv>
          <StyledSecondLevelButton>vegan</StyledSecondLevelButton>
          <StyledSecondLevelButton>vegetarian</StyledSecondLevelButton>
          <StyledSecondLevelButton>carnivore</StyledSecondLevelButton>
          <StyledSecondLevelButton>pescetarian</StyledSecondLevelButton>
          <StyledSecondLevelButton>keto</StyledSecondLevelButton>
        </StyledSecondLevelDiv>
      )}
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
      <ScrollToTop />
      <IconButtonLarge
        style={"plus"}
        bottom="6rem"
        onClick={() => router.push("/addRecipe")}
      />
    </>
  );
}

const StyledFilterButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 0.5rem;
  right: 2rem;
`;

const StyledTopDiv = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: calc(100% - (2 * var(--gap-out)));
  margin: auto;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StyledSecondLevelDiv = styled.div`
  display: flex;
  justify-content: center;
  max-width: calc(100% - (2 * var(--gap-out)));
  margin: auto;
  margin-top: 0.25rem;
  flex-wrap: wrap;
`;

const StyledTopButton = styled.button`
  color: var(--color-darkgrey);
  border: solid var(--color-darkgrey) 1px;
  border: none;
  border-radius: var(--border-radius-small);
  background-color: var(--color-component);
  width: 5rem;
`;

const StyledSecondLevelButton = styled.button`
  background-color: var(--color-darkgrey);
  border: none;
  border-radius: var(--border-radius-small);
  color: var(--color-component);
  width: 6rem;
  height: 1.5rem;
  margin-right: 1rem;
  margin-bottom: 0.25rem;
  padding: 0.25rem;
`;
