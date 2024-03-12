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
  const [isDifficultyButton, setIsDifficultyButton] = useState([
    false,
    false,
    false,
  ]);
  const [isDurationButton, setIsDurationButton] = useState([
    false,
    false,
    false,
  ]);
  const [isNutritionButton, setIsNutritionButton] = useState([
    false,
    false,
    false,
  ]);

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
  }

  function toggleDifficulty(index) {
    const updatedState = [...isDifficultyButton];
    updatedState[index] = !updatedState[index];
    setIsDifficultyButton(updatedState);
  }

  function toggleDuration(index) {
    const updatedState = [...isDurationButton];
    updatedState[index] = !updatedState[index];
    setIsDurationButton(updatedState);
  }

  function toggleNutrition(index) {
    const updatedState = [...isNutritionButton];
    updatedState[index] = !updatedState[index];
    setIsNutritionButton(updatedState);
  }

  function resetCategories() {
    setIsDifficultyButton([false, false, false]);
    setIsDurationButton([false, false, false]);
    setIsNutritionButton([false, false, false, false, false]);
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
          width="20"
          height="20"
        >
          <path d="m4,4.036V.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v3.536c-1.694.243-3,1.704-3,3.464s1.306,3.221,3,3.464v12.536c0,.276.224.5.5.5s.5-.224.5-.5v-12.536c1.694-.243,3-1.704,3-3.464s-1.306-3.221-3-3.464Zm-.5,5.964c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Zm9,3.036V.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12.536c-1.694.243-3,1.704-3,3.464s1.306,3.221,3,3.464v3.536c0,.276.224.5.5.5s.5-.224.5-.5v-3.536c1.694-.243,3-1.704,3-3.464s-1.306-3.221-3-3.464Zm-.5,5.964c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Zm12-11.5c0-1.76-1.306-3.221-3-3.464V.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v3.536c-1.694.243-3,1.704-3,3.464s1.306,3.221,3,3.464v12.536c0,.276.224.5.5.5s.5-.224.5-.5v-12.536c1.694-.243,3-1.704,3-3.464Zm-3.5,2.5c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Z" />
        </svg>
      </StyledFilterButton>
      {isFilterButton && (
        <>
          <StyledH2>Schwierigkeit</StyledH2>
          <StyledResetButton onClick={resetCategories}>
            alles Zurücksetzen
          </StyledResetButton>
          <StyledCategoriesDiv>
            <StyledCategoryButton
              onClick={() => toggleDifficulty(0)}
              isActive={isDifficultyButton[0]}
            >
              einfach
            </StyledCategoryButton>
            <StyledCategoryButton
              onClick={() => toggleDifficulty(1)}
              isActive={isDifficultyButton[1]}
            >
              mittel
            </StyledCategoryButton>
            <StyledCategoryButton
              onClick={() => toggleDifficulty(2)}
              isActive={isDifficultyButton[2]}
            >
              hart
            </StyledCategoryButton>
          </StyledCategoriesDiv>
          <StyledH2>Zubereitungsdauer</StyledH2>
          <StyledCategoriesDiv>
            <StyledCategoryButton
              onClick={() => toggleDuration(0)}
              isActive={isDurationButton[0]}
            >
              {" "}
              {"< 10"} Min
            </StyledCategoryButton>
            <StyledCategoryButton
              onClick={() => toggleDuration(1)}
              isActive={isDurationButton[1]}
            >
              10 - 20 Min
            </StyledCategoryButton>
            <StyledCategoryButton
              onClick={() => toggleDuration(2)}
              isActive={isDurationButton[2]}
            >
              {"> 20 Min"}
            </StyledCategoryButton>
          </StyledCategoriesDiv>
          <StyledH2>Ernährung</StyledH2>
          <StyledCategoriesDiv>
            <StyledCategoryButton
              onClick={() => toggleNutrition(0)}
              isActive={isNutritionButton[0]}
            >
              vegan
            </StyledCategoryButton>
            <StyledCategoryButton
              onClick={() => toggleNutrition(1)}
              isActive={isNutritionButton[1]}
            >
              vegetarisch
            </StyledCategoryButton>
            <StyledCategoryButton
              onClick={() => toggleNutrition(2)}
              isActive={isNutritionButton[2]}
            >
              Fleisch
            </StyledCategoryButton>
            <StyledCategoryButton
              onClick={() => toggleNutrition(3)}
              isActive={isNutritionButton[3]}
            >
              pescetarisch
            </StyledCategoryButton>
            <StyledCategoryButton
              onClick={() => toggleNutrition(4)}
              isActive={isNutritionButton[4]}
            >
              Keto
            </StyledCategoryButton>
          </StyledCategoriesDiv>
        </>
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
  top: 1rem;
  right: 2rem;
`;

const StyledResetButton = styled.button`
  background-color: transparent;
  border: none;
  position: absolute;
  top: 4rem;
  right: 1.5rem;
  font-weight: bold;
`;

const StyledH2 = styled.h2`
  font-size: large;
  text-align: left;
  width: calc(100% - (2 * var(--gap-out)));
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  box-sizing: border-box;
  position: relative;
`;

const StyledCategoriesDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: calc(100% - (2 * var(--gap-out)));
  margin: auto;
  margin-top: 0.25rem;
`;

const StyledCategoryButton = styled.button`
  background-color: ${(props) =>
    props.isActive ? "var(--color-darkgrey)" : "var(--color-component)"};
  color: ${(props) =>
    props.isActive ? "var(--color-component)" : "var(--color-darkgrey)"};
  border: solid var(--color-darkgrey) 1px;
  border-radius: var(--border-radius-small);
  width: 6rem;
  height: 1.75rem;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem;
`;
