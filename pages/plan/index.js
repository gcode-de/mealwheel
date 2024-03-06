import Link from "next/link";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import CardSkeleton from "@/components/Styled/CardSkeleton";
import Header from "@/components/Styled/Header";
import MealCard from "@/components/Styled/MealCard";
import IconButton from "@/components/Styled/IconButton";
import RandomnessSlider from "@/components/Styled/RandomnessSlider";
import Button from "@/components/Styled/StyledButton";

import generateWeekdays from "@/helpers/generateWeekdays";
import assignRecipesToWeekdays from "@/helpers/assignRecipesToWeekdays";

export default function Plan({
  isLoading,
  error,
  user,
  getRecipeProperty,
  toggleIsFavorite,
}) {
  const router = useRouter();
  const weekOffset = Number(router.query.week) || 0;
  const [weekdays, setWeekdays] = useState();
  const [numberOfRandomRecipes, setNumberOfRandomRecipes] = useState(2);

  useEffect(() => {
    setWeekdays(generateWeekdays(weekOffset));
  }, [weekOffset]);

  const {
    data: randomRecipes,
    isLoading: randomRecipesIsLoading,
    error: randomRecipesError,
  } = useSWR(`/api/recipes/random/7`);

  const userRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.hasCooked)
    .map((recipe) => recipe.recipe);

  const handleSliderChange = (event) => {
    setNumberOfRandomRecipes(parseInt(event.target.value, 10));
  };

  if (error || randomRecipesError) {
    <div>
      <Header text={"Wochenplan 🥗"} />
      Daten konnten nicht geladen werden...
    </div>;
  }

  if (isLoading || randomRecipesIsLoading) {
    return (
      <>
        <Header text={"Wochenplan 🥗"} />
        <h2>Lade Kalender...</h2>
        <CalendarContainer>
          <CardSkeleton amount={5} $isLoading />
        </CalendarContainer>
      </>
    );
  }

  return (
    <>
      <StyledHeader>
        <Header text={"Wochenplan 🥗"} />

        <CalendarNavigation>
          <IconButton
            style="TriangleLeft"
            left="3rem"
            top="0.5rem"
            onClick={() => {
              router.push(`/plan?week=${weekOffset - 1}`);
            }}
          />
          <Link href={`/plan?week=0`}>zur aktuellen Woche</Link>
          <IconButton
            style="TriangleRight"
            right="3rem"
            top="0.5rem"
            onClick={() => {
              router.push(`/plan?week=${weekOffset + 1}`);
            }}
          />
        </CalendarNavigation>

        <RandomnessSliderContainer>
          <p>Zufällige Rezepte: {numberOfRandomRecipes}</p>
          {weekdays && (
            <RandomnessSlider
              type="range"
              min="0"
              max={weekdays.length}
              value={numberOfRandomRecipes}
              onChange={handleSliderChange}
            />
          )}
        </RandomnessSliderContainer>
      </StyledHeader>

      <CalendarContainer>
        {weekdays &&
          weekdays.map((weekday, index) => (
            <article key={weekday.date} id={weekday.date}>
              <h2>{weekday.readableDate}</h2>
              {weekday.recipe ? (
                <MealCard
                  key={weekday.recipe._id}
                  recipe={weekday.recipe}
                  isFavorite={getRecipeProperty(
                    weekday.recipe._id,
                    "isFavorite"
                  )}
                  onToggleIsFavorite={toggleIsFavorite}
                />
              ) : (
                <CardSkeleton />
              )}
            </article>
          ))}
      </CalendarContainer>
      <ButtonsContainer>
        <Button
          onClick={() => {
            assignRecipesToWeekdays(
              setWeekdays,
              userRecipes,
              randomRecipes,
              numberOfRandomRecipes
            );
          }}
        >
          Rezepte einfügen
        </Button>
      </ButtonsContainer>
    </>
  );
}

const StyledHeader = styled.header``;

const CalendarNavigation = styled.div`
  position: relative;
  width: 100%;
  height: 3rem;
  text-align: center;
  padding: 1.25rem;
  a {
    color: var(--color-font);
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
  }
  margin-bottom: 1.25rem;
  margin-top: 0.5rem;
`;

const RandomnessSliderContainer = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  padding: 1rem;
  p {
    color: var(--color-font);
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    margin-bottom: 0.5rem;
  }
`;

const CalendarContainer = styled.ul`
  padding: 10px;
  max-width: 350px;
  margin: 0 auto 80px auto;
  h2 {
    font-size: 1rem;
    margin: 20px 0 -15px 5px;
    padding: 0;
  }
`;

const ButtonsContainer = styled.div`
  position: fixed;
  bottom: 80px;
  display: flex;
  justify-content: space-between;
`;
