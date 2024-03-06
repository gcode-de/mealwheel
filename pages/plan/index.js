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
import assignRecipesToWeekdays from "@/helpers/assignRecipesToWeekdays";

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
    //generate week days for current view
    const generatedWeekdays = generateWeekdays(weekOffset);

    //import existing days with recipes from database
    if (user && generatedWeekdays) {
      const updatedWeekdays = generatedWeekdays.map((weekday) => {
        // Konvertieren Sie das Datum des Wochentags in das Format YYYY-MM-DD
        const weekdayDateString = weekday.date.toISOString().slice(0, 10);
        // Finden Sie den entsprechenden Tag im Kalender des Benutzers
        const calendarDay = user.calendar.find(
          (calendarDay) => calendarDay.date.slice(0, 10) === weekdayDateString
        );

        // Wenn ein entsprechender Tag gefunden wurde, aktualisieren Sie den Wochentag mit diesen Daten
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
      console.log(updatedWeekdays);
      setWeekdays(updatedWeekdays);
    }
  }, [weekOffset, user]);

  const {
    data: randomRecipes,
    isLoading: randomRecipesIsLoading,
    error: randomRecipesError,
  } = useSWR(`/api/recipes/random/7`);

  const getRandomRecipe = async () => {
    const response = await fetch(`/api/recipes/random/`);
    const recipe = await response.json();
    return recipe;
  };

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
    return user.calendar.find((calendarDay) => calendarDay.date === day);
  }

  const changeNumberOfPeople = async (day, change) => {
    user.calendar.map((calendarDay) =>
      new Date(calendarDay.date).toISOString().slice(0, 10) ===
      day.toISOString().slice(0, 10)
        ? {
            ...calendarDay,
            numberOfPeople: calendarDay.numberOfPeople + change,
          }
        : calendarDay
    );
    updateUserinDb();
  };

  const reassignRecipe = async (day) => {
    user.calendar.map((calendarDay) =>
      new Date(calendarDay.date).toISOString().slice(0, 10) ===
      day.toISOString().slice(0, 10)
        ? { ...calendarDay, recipe: getRandomRecipe()[0] }
        : calendarDay
    );
    console.log(day, getRandomRecipe());
    updateUserinDb();
  };

  const removeRecipe = (day) => {
    user.calendar.map((calendarDay) =>
      new Date(calendarDay.date).toISOString().slice(0, 10) ===
      day.toISOString().slice(0, 10)
        ? { ...calendarDay, recipe: null }
        : calendarDay
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
          weekdays.map((weekday, index) => (
            <article key={weekday.date} id={weekday.date}>
              <h2>{weekday.readableDate}</h2>
              {weekday.recipe ? (
                <MealCard
                  key={weekday.recipe._id}
                  recipe={weekday.recipe}
                  // isFavorite={getRecipeProperty(
                  //   weekday.recipe._id,
                  //   "isFavorite"
                  // )}
                  // onToggleIsFavorite={toggleIsFavorite}
                  numberOfPeople={4}
                  changeNumberOfPeople={changeNumberOfPeople}
                  reassignRecipe={reassignRecipe}
                  removeRecipe={removeRecipe}
                  day={weekday.date}
                />
              ) : (
                <CardSkeleton />
              )}
            </article>
          ))}
      </CalendarContainer>
      <ButtonsContainer>
        <GenerateButton
          onClick={() => {
            assignRecipesToWeekdays(
              setWeekdays,
              userRecipes,
              randomRecipes,
              numberOfRandomRecipes,
              weekdays,
              user
            );
            // updateUserinDb();
          }}
        >
          Rezepte einfügen
        </GenerateButton>
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
const GenerateButton = styled.button`
  border: none;
  background-color: var(--color-darkgrey);
  color: var(--color-background);
  font-size: 0%.75rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
  width: 9rem;
  height: 3rem;
`;
