import Link from "next/link";
import styled from "styled-components";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import CardSkeleton from "@/components/Styled/CardSkeleton";
import Header from "@/components/Styled/Header";
import MealCard from "@/components/MealCard";
import IconButton from "@/components/Styled/IconButton";
import RandomnessSlider from "@/components/Styled/RandomnessSlider";
import PowerIcon from "@/public/icons/power-material-svgrepo-com.svg";
import Rotate from "@/public/icons/svg/arrows-retweet_9253335.svg";
import Xmark from "@/public/icons/svg/trash-xmark_10741775.svg";
import Menu from "@/public/icons/svg/menu.svg";

import generateWeekdays from "@/helpers/generateWeekdays";
import assignRecipeToCalendarDay from "@/helpers/assignRecipesToCalendarDays";
import populateEmptyWeekdays from "@/helpers/populateEmptyWeekdays";
import updateUserinDb from "@/helpers/updateUserInDb";
import assignRecipesToCalendarDays from "@/helpers/assignRecipesToCalendarDays";
import LoadingComponent from "@/components/Loading";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";
import { notifySuccess, notifyError } from "/helpers/toast";
import ToggleCheckbox from "@/components/Styled/ToggleCheckbox";
import MenuContainer from "@/components/MenuContainer";

export default function Plan({
  isLoading,
  error,
  user,
  getRecipeProperty,
  toggleIsFavorite,
  mutateUser,
  recipes,
}) {
  const router = useRouter();
  const weekOffset = Number(router.query.week) || 0;

  const [weekdays, setWeekdays] = useState([]);
  const [assignableDays, setAssignableDays] = useState([]);
  const [numberOfRandomRecipes, setNumberOfRandomRecipes] = useState(0);
  const [isRandomnessActive, setIsRandomnessActive] = useState(false);
  const [menuVisible, setMenuVisible] = useState(
    weekdays ? new Array(weekdays.length).fill(false) : []
  );

  function toggleRandomness() {
    setIsRandomnessActive(!isRandomnessActive);
  }

  function toggleMenu(index) {
    setMenuVisible((prevMenuVisible) => {
      const updatedMenuVisible = [...prevMenuVisible];
      updatedMenuVisible[index] = !prevMenuVisible[index];
      return updatedMenuVisible;
    });
  }

  useEffect(() => {
    const generatedWeekdays = generateWeekdays(weekOffset);

    if (user && generatedWeekdays) {
      setWeekdays(generatedWeekdays);

      let countAssignableDays = [];
      //count days of currently selected week
      //that are not disabled manuallly,
      //that are not disabled by default and also not manually enabled,
      //and that don't have a reference to a recipe
      generatedWeekdays.forEach((weekday) => {
        const calendarDay = user.calendar.find(
          (day) => day.date === weekday.date
        );
        const dayOfWeek = new Date(weekday.date).getDay();

        const isDayManuallyDisabled = calendarDay?.hasOwnProperty("isDisabled")
          ? calendarDay.isDisabled
          : null;

        let isDayActive;
        if (isDayManuallyDisabled !== null) {
          // prioritize manual setting
          isDayActive = !isDayManuallyDisabled;
        } else {
          // fallback to default setting
          isDayActive = user?.settings?.weekdaysEnabled?.[dayOfWeek];
        }

        if (isDayActive && !calendarDay?.recipe) {
          countAssignableDays.push(weekday.date);
        }
      });

      setAssignableDays(countAssignableDays);

      numberOfRandomRecipes > countAssignableDays.length &&
        setNumberOfRandomRecipes(countAssignableDays.length);
    }
  }, [weekOffset, user, numberOfRandomRecipes]);

  const {
    data: randomRecipes,
    isLoading: randomRecipesIsLoading,
    error: randomRecipesError,
  } = useSWR(`/api/recipes/random/10`);

  async function getRandomRecipe() {
    const response = await fetch(`/api/recipes/random/`);
    const recipe = await response.json();
    return recipe;
  }

  function getCalendarDayFromDb(date) {
    return user.calendar.find((calendarDay) => calendarDay.date === date);
  }

  const handleSliderChange = (event) => {
    setNumberOfRandomRecipes(parseInt(event.target.value, 10));
  };

  const toggleDayIsDisabled = async (day) => {
    await createUserCalenderIfMissing();
    if (user.calendar.some((calendarDay) => calendarDay.date === day)) {
      user.calendar = user.calendar.map((calendarDay) =>
        calendarDay.date === day
          ? { ...calendarDay, isDisabled: !calendarDay.isDisabled }
          : calendarDay
      );
    } else {
      user.calendar.push({
        date: day,
        isDisabled: checkIfWeekdayIsDefaultEnabled(day),
      });
    }
    await updateUserinDb(user, mutateUser);
  };

  const changeNumberOfPeople = async (day, change) => {
    user.calendar = user.calendar.map((calendarDay) =>
      calendarDay.date === day
        ? {
            ...calendarDay,
            numberOfPeople: Math.max(1, calendarDay.numberOfPeople + change),
          }
        : calendarDay
    );
    await updateUserinDb(user, mutateUser);
  };

  const createUserCalenderIfMissing = async () => {
    if (!user.calendar) {
      user.calendar = [];
      await updateUserinDb();
    }
  };

  const reassignRecipe = async (day) => {
    const randomRecipe = await getRandomRecipe();
    assignRecipeToCalendarDay(
      [{ date: day, recipe: randomRecipe[0] }],
      user,
      mutateUser
    );
  };

  const removeRecipe = (day) => {
    assignRecipeToCalendarDay([{ date: day, recipe: null }], user, mutateUser);
  };

  const removeAllRecipes = (weekdays) => {
    // Erstellen eines Arrays von Objekten für jede Zutat, die entfernt werden soll
    const assignments = weekdays.map((day) => ({
      date: day.date,
      recipe: null,
    }));

    assignRecipesToCalendarDays(assignments, user, mutateUser);
  };

  const checkIfWeekdayIsDefaultEnabled = (date) => {
    return user.settings.weekdaysEnabled[new Date(date).getDay()];
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // Drag wird nach 10 Pixel Bewegung aktiviert
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // Drag wird nach einer Verzögerung von 250ms aktiviert
      tolerance: 5, // Drag wird aktiviert, wenn die Berührung um 5 Pixel bewegt wurde
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const SortableWeekday = ({ weekday, calendarDay }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: weekday.date });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
      <article
        {...attributes}
        {...listeners}
        id={weekday.date}
        ref={setNodeRef}
        style={style}
      >
        {calendarDay?.recipe && !calendarDay?.isDisabled ? (
          <MealCard
            key={calendarDay.recipe._id}
            recipe={calendarDay.recipe}
            numberOfPeople={
              calendarDay.numberOfPeople !== undefined &&
              calendarDay.numberOfPeople !== null
                ? Number(calendarDay.numberOfPeople)
                : user.settings.defaultNumberOfPeople
            }
            changeNumberOfPeople={(change) =>
              changeNumberOfPeople(calendarDay.date, change)
            }
            reassignRecipe={reassignRecipe}
            removeRecipe={removeRecipe}
            day={calendarDay.date}
            isFavorite={null}
            user={user}
          />
        ) : (
          <CardSkeleton
            reassignRecipe={reassignRecipe}
            day={calendarDay?.date || weekday.date}
            $height={
              calendarDay?.isDisabled ??
              !checkIfWeekdayIsDefaultEnabled(weekday.date)
                ? "small"
                : ""
            }
            weekdays={weekdays}
          />
        )}
      </article>
    );
  };

  function onDragEnd({ active, over }) {
    if (!over || active.id === over.id) {
      return;
    }

    const fromIndex = weekdays.findIndex((day) => day.date === active.id);
    const toIndex = weekdays.findIndex((day) => day.date === over.id);

    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const datesArray = weekdays.map((day) => day.date);
    const recipesArray = weekdays.map(
      (day) => getCalendarDayFromDb(day.date)?.recipe?._id
    );

    // Verschiebe die Rezept-ID im recipesArray basierend auf der Drag-and-Drop Aktion
    const [movedItem] = recipesArray.splice(fromIndex, 1);
    recipesArray.splice(toIndex, 0, movedItem);

    // Erstelle ein Array von Objekten mit "date" und "recipe" Eigenschaften
    const resultArray = datesArray.map((date, index) => {
      return {
        date: date,
        recipe: recipesArray[index],
      };
    });

    assignRecipesToCalendarDays(resultArray, user, mutateUser);
  }

  if (error || randomRecipesError) {
    <div>
      <Header text={"Wochenplan"} />
      Daten konnten nicht geladen werden...
    </div>;
  }

  if (isLoading || randomRecipesIsLoading) {
    return (
      <>
        <Header text={"Wochenplan"} />
        <LoadingComponent amount />
      </>
    );
  }

  if (!user) {
    return (
      <StyledHeader>
        <Header text={"Wochenplan"} />
        <CalendarContainer>
          Bitte <Link href="/api/auth/signin">einloggen</Link>, um den
          Wochenplaner zu nutzen.
          <CardSkeleton amount={3} />
        </CalendarContainer>
      </StyledHeader>
    );
  }

  function saveToShopping() {
    const recipesId = weekdays.map(
      (day) => getCalendarDayFromDb(day.date)?.recipe?._id
    );
    const findRecipes = recipesId.map(
      (id) => recipes.find((recipe) => recipe._id === id)?.ingredients
    );
    const servingsPerDay = weekdays.map(
      (day) => getCalendarDayFromDb(day.date)?.numberOfPeople
    );

    const multipliedQuantities = findRecipes
      .map((ingredients, index) => {
        if (ingredients) {
          return ingredients.map((ingredient) => {
            return {
              ...ingredient,
              quantity: ingredient.quantity * servingsPerDay[index],
            };
          });
        }
        return [];
      })
      .filter((recipe) => recipe.length > 0);
    const combinedIngredients = multipliedQuantities.reduce(
      (acc, curr) => acc.concat(curr),
      []
    );
    user.shoppingList.push(
      ...combinedIngredients.map((ingredient) => ({
        ...ingredient,
        isChecked: false,
      }))
    );

    updateUserinDb(user, mutateUser);
    notifySuccess("Einkaufsliste aktualisiert");
  }

  return (
    <>
      <StyledHeader>
        <Header text={"Wochenplan"} />
        <CalendarNavigation>
          <IconButton
            style="ArrowSmallLeft"
            left="var(--gap-out)"
            top="0.5rem"
            onClick={() => {
              router.push(`/plan?week=${weekOffset - 1}`);
            }}
          />
          {weekOffset === 0 || weekOffset === undefined ? (
            `aktuelle Woche`
          ) : (
            <Link href={`/plan?week=0`}>zur aktuellen Woche</Link>
          )}
          <IconButton
            style="ArrowSmallRight"
            right="var(--gap-out)"
            top="0.5rem"
            rotate180="180deg"
            onClick={() => {
              router.push(`/plan?week=${weekOffset + 1}`);
            }}
          />
        </CalendarNavigation>

        <IconButton
          right="var(--gap-out)"
          top="0.25rem"
          style="Menu"
          rotate={isRandomnessActive}
          onClick={toggleRandomness}
        >
          Anzahl der zufälligen Gerichte
        </IconButton>
        {isRandomnessActive && (
          <RandomnessSliderContainer>
            {assignableDays.length > 0 ? (
              <p>Zufällige Rezepte: {numberOfRandomRecipes}</p>
            ) : (
              <p>Alle Tage geplant.</p>
            )}
            {weekdays && (
              <RandomnessSlider
                type="range"
                $isActive={assignableDays.length > 0}
                min="0"
                max={assignableDays.length}
                value={numberOfRandomRecipes}
                onChange={handleSliderChange}
              />
            )}
          </RandomnessSliderContainer>
        )}
      </StyledHeader>

      <CalendarContainer>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          sensors={sensors}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={weekdays.map((weekday) => weekday.date)}
            strategy={verticalListSortingStrategy}
          >
            {weekdays &&
              weekdays.map((weekday, index) => {
                const calendarDay = getCalendarDayFromDb(weekday.date);
                return (
                  <Fragment key={weekday.date}>
                    <StyledH2
                      $dayIsDisabled={
                        calendarDay?.isDisabled ??
                        !checkIfWeekdayIsDefaultEnabled(weekday.date)
                      }
                    >
                      {/* <StyledPowerIcon
                        $dayIsDisabled={
                          calendarDay?.isDisabled ??
                          !checkIfWeekdayIsDefaultEnabled(weekday.date)
                        }
                        onClick={() => {
                          toggleDayIsDisabled(weekday.date);
                        }}
                      /> */}
                      <ToggleCheckbox
                        defaultChecked={
                          calendarDay?.hasOwnProperty("isDisabled")
                            ? !calendarDay?.isDisabled
                            : checkIfWeekdayIsDefaultEnabled(weekday.date)
                        }
                        onChange={() => {
                          toggleDayIsDisabled(weekday.date);
                          removeRecipe(weekday.date);
                        }}
                        sliderSize="1rem"
                        index={index}
                      />
                      {calendarDay?.isDisabled}
                      {weekday.readableDate}
                      <MenuButton onClick={() => toggleMenu(index)}>
                        <StyledMenu width={25} height={25} />
                      </MenuButton>
                      {menuVisible[index] && (
                        <MenuContainer
                          top="var(--gap-between)"
                          right="calc(3 * var(--gap-between) + 10px)"
                        >
                          <UnstyledButton
                            onClick={() => {
                              reassignRecipe(weekdays[index].date);
                            }}
                          >
                            <Rotate width={15} height={15} /> zufälliges Rezept
                            hinzufügen
                          </UnstyledButton>
                          <UnstyledButton
                            onClick={() => {
                              removeRecipe(weekdays[index].date);
                            }}
                          >
                            <Xmark width={15} height={15} />
                            Tag leeren
                          </UnstyledButton>
                        </MenuContainer>
                      )}
                    </StyledH2>
                    <SortableWeekday
                      key={weekday.date}
                      weekday={weekday}
                      calendarDay={calendarDay}
                    />
                  </Fragment>
                );
              })}
          </SortableContext>
        </DndContext>
      </CalendarContainer>

      <IconButtonLarge
        style={"saveShopping"}
        bottom="10rem"
        onClick={() => saveToShopping()}
      />
      {assignableDays.length !== 0 ? (
        <IconButtonLarge
          style={"generate"}
          bottom="6rem"
          onClick={() => {
            populateEmptyWeekdays(
              weekdays,
              assignableDays,
              randomRecipes,
              numberOfRandomRecipes,
              user,
              mutateUser
            );
          }}
        />
      ) : (
        <IconButtonLarge
          style={"trash"}
          bottom="6rem"
          onClick={() => {
            removeAllRecipes(weekdays);
          }}
        />
      )}
    </>
  );
}

const StyledHeader = styled.header``;

const CalendarNavigation = styled.div`
  position: relative;
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
  padding: 0;
  width: calc(100% - (2 * var(--gap-out)));
  margin: auto;
  margin-bottom: 80px;
`;

const StyledH2 = styled.h2`
  font-size: 1rem;
  margin: 20px 0 -15px 0;
  color: ${(props) => props.$dayIsDisabled && "var(--color-lightgrey)"};
  text-decoration: ${(props) => (props.$dayIsDisabled ? "line-through" : "")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const MenuButton = styled.button`
  background-color: transparent;
  border: none;
  position: absolute;
  right: 0;
`;

const StyledMenu = styled(Menu)`
  background-color: var(--color-background);
  rotate: 90deg;
  cursor: pointer;
`;

const UnstyledButton = styled.button`
  background-color: transparent;
  border: none;
  text-align: start;
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  gap: var(--gap-between);
  height: 2rem;
  color: var(--color-font);
  &:hover {
    background-color: var(--color-background);
  }
`;

// const StyledPowerIcon = styled(PowerIcon)`
//   width: 1.5rem;
//   height: 1.5rem;
//   margin: -0.5rem 0.3rem 0 -0.2rem;
//   position: relative;
//   top: 0.3rem;
//   fill: ${(props) =>
//     props.$dayIsDisabled ? "var(--color-lightgrey)" : "var(--color-highlight)"};
//   cursor: pointer;
// `;
