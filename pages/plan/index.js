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

import generateWeekdays from "@/helpers/generateWeekdays";

export default function Plan({
  isLoading,
  error,
  user,
  getRecipeProperty,
  toggleIsFavorite,
  mutateUser,
}) {
  const router = useRouter();
  const weekOffset = Number(router.query.week) || 0;
  const [weekdays, setWeekdays] = useState();
  const [numberOfRandomRecipes, setNumberOfRandomRecipes] = useState(2);

  useEffect(() => {
    const generatedWeekdays = generateWeekdays(weekOffset);

    if (user && generatedWeekdays) {
      const updatedWeekdays = generatedWeekdays.map((weekday) => {
        const calendarDay = user.calendar.find(
          (calendarDay) => calendarDay.date === weekday.date
        );

        if (calendarDay) {
          return {
            ...weekday,
            recipe: calendarDay.recipe,
            isDisabled: calendarDay.isDisabled,
            servings: calendarDay.servings,
          };
        }

        return weekday;
      });
      setWeekdays(updatedWeekdays);
    }
  }, [weekOffset, user]);

  const {
    data: randomRecipes,
    isLoading: randomRecipesIsLoading,
    error: randomRecipesError,
  } = useSWR(`/api/recipes/random/7`);

  async function getRandomRecipe() {
    const response = await fetch(`/api/recipes/random/`);
    const recipe = await response.json();
    return recipe;
  }

  const userRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.hasCooked)
    .map((recipe) => recipe.recipe);

  const handleSliderChange = (event) => {
    setNumberOfRandomRecipes(parseInt(event.target.value, 10));
  };

  async function updateUserinDb() {
    const response = await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      mutateUser();
    }
  }

  function getCalendarDayFromDb(date) {
    return user.calendar.find((calendarDay) => calendarDay.date === date);
  }

  const changeNumberOfPeople = async (day, change) => {
    user.calendar = user.calendar.map((calendarDay) =>
      calendarDay.date === day
        ? {
            ...calendarDay,
            numberOfPeople: Math.max(1, calendarDay.numberOfPeople + change),
          }
        : calendarDay
    );
    updateUserinDb();
  };

  const reassignRecipe = async (day) => {
    const randomRecipe = await getRandomRecipe();

    if (user.calendar.some((calendarDay) => calendarDay.date === day)) {
      user.calendar = user.calendar.map((calendarDay) =>
        calendarDay.date === day
          ? { ...calendarDay, recipe: randomRecipe[0] }
          : calendarDay
      );
    } else {
      user.calendar.push({
        date: day,
        recipe: randomRecipe[0],
        numberOfPeople: user.settings.defaultNumberOfPeople,
      });
    }

    await updateUserinDb();
  };

  const removeRecipe = (day) => {
    user.calendar = user.calendar.map((calendarDay) =>
      calendarDay.date === day ? { ...calendarDay, recipe: null } : calendarDay
    );
    updateUserinDb();
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
          weekdays.map((weekday) => {
            const calendarDay = getCalendarDayFromDb(weekday.date);
            return (
              <article key={weekday.date} id={weekday.date}>
                <h2>{weekday.readableDate}</h2>
                {calendarDay?.recipe ? (
                  <MealCard
                    key={calendarDay.recipe._id}
                    recipe={calendarDay.recipe}
                    numberOfPeople={
                      calendarDay.numberOfPeople !== undefined &&
                      calendarDay.numberOfPeople !== null
                        ? Number(calendarDay.numberOfPeople)
                        : user.settings.defaultNumberOfPeople
                    }
                    changeNumberOfPeople={changeNumberOfPeople}
                    reassignRecipe={reassignRecipe}
                    removeRecipe={removeRecipe}
                    day={calendarDay.date}
                  />
                ) : (
                  <CardSkeleton
                    reassignRecipe={reassignRecipe}
                    day={calendarDay?.date || weekday.date}
                  />
                )}
              </article>
            );
          })}
      </CalendarContainer>
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
