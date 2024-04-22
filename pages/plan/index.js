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

import CardSkeleton from "@/components/Cards/CardSkeleton";
import Header from "@/components/Styled/Header";
import MealCard from "@/components/Cards/MealCard";
import IconButton from "@/components/Button/IconButton";
import RandomnessSlider from "@/components/RandomnessSlider";

import generateWeekdays from "@/helpers/generateWeekdays";
import assignRecipeToCalendarDay from "@/helpers/assignRecipesToCalendarDays";
import populateEmptyWeekdays from "@/helpers/populateEmptyWeekdays";
import updateUserinDb from "@/helpers/updateUserInDb";
import updateHouseholdInDb from "@/helpers/updateHouseholdInDb";
import assignRecipesToCalendarDays from "@/helpers/assignRecipesToCalendarDays";
import LoadingComponent from "@/components/Loading";
import IconButtonLarge from "@/components/Button/IconButtonLarge";
import { notifySuccess, notifyError } from "/helpers/toast";
import ToggleCheckbox from "@/components/ToggleCheckbox";
import DietSelector from "@/components/DietSelector";
import { filterTags } from "@/helpers/filterTags";
import ModalInput from "@/components/Modal/input";

export default function Plan({
  isLoading,
  error,
  user,
  mutateUser,
  userIsHouseholdAdmin,
  getRecipeProperty,
  toggleIsFavorite,
  recipes,
  household,
  householdIsLoading,
  householdError,
  mutateHousehold,
}) {
  const router = useRouter();
  const weekOffset = Number(router.query.week) || 0;

  const [weekdays, setWeekdays] = useState([]);
  const [assignableDays, setAssignableDays] = useState([]);
  const [numberOfRandomRecipes, setNumberOfRandomRecipes] = useState(0);
  const dietTypes = filterTags.find((tag) => tag.type === "diet").options;
  const [dietForRandomRecipes, setDietForRandomRecipes] = useState(
    household?.settings?.defaultDiet
  );
  const [isRandomnessActive, setIsRandomnessActive] = useState(false);
  const [isNoteModalActive, setIsNoteModalActive] = useState(false);
  const [calendarDayToEdit, setCalendarDayToEdit] = useState(null);

  function toggleRandomness() {
    setIsRandomnessActive(!isRandomnessActive);
  }

  useEffect(() => {
    const generatedWeekdays = generateWeekdays(weekOffset);

    if (household && generatedWeekdays) {
      setWeekdays(generatedWeekdays);

      let countAssignableDays = [];
      //count days of currently selected week
      //that are not disabled manuallly,
      //that are not disabled by default and also not manually enabled,
      //and that don't have a reference to a recipe
      generatedWeekdays.forEach((weekday) => {
        const calendarDay = household.calendar.find(
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
          isDayActive = household?.settings?.weekdaysEnabled?.[dayOfWeek];
        }

        if (isDayActive && !calendarDay?.recipe) {
          countAssignableDays.push(weekday.date);
        }
      });

      setAssignableDays(countAssignableDays);

      numberOfRandomRecipes > countAssignableDays.length &&
        setNumberOfRandomRecipes(countAssignableDays.length);
    }
  }, [weekOffset, household, numberOfRandomRecipes]);

  const {
    data: randomRecipes,
    isLoading: randomRecipesIsLoading,
    error: randomRecipesError,
  } = useSWR(`/api/recipes/random/10?diet=${dietForRandomRecipes}`);

  async function getRandomRecipe() {
    const response = await fetch(
      `/api/recipes/random/?diet=${dietForRandomRecipes}`
    );
    const recipe = await response.json();
    return recipe;
  }

  function getCalendarDayFromDb(date) {
    return household.calendar.find((calendarDay) => calendarDay.date === date);
  }

  const handleSliderChange = (event) => {
    setNumberOfRandomRecipes(parseInt(event.target.value, 10));
  };

  const toggleDayIsDisabled = async (day) => {
    await createUserCalenderIfMissing();
    if (household.calendar.some((calendarDay) => calendarDay.date === day)) {
      household.calendar = household.calendar.map((calendarDay) =>
        calendarDay.date === day
          ? { ...calendarDay, isDisabled: !calendarDay.isDisabled }
          : calendarDay
      );
    } else {
      household.calendar.push({
        date: day,
        isDisabled: checkIfWeekdayIsDefaultEnabled(day),
      });
    }
    await updateHouseholdInDb(household, mutateHousehold);
  };

  const changeNumberOfPeople = async (day, change) => {
    household.calendar = household.calendar.map((calendarDay) =>
      calendarDay.date === day
        ? {
            ...calendarDay,
            numberOfPeople: Math.max(1, calendarDay.numberOfPeople + change),
          }
        : calendarDay
    );
    await updateHouseholdInDb(household, mutateHousehold);
  };

  const createUserCalenderIfMissing = async () => {
    if (!household.calendar) {
      household.calendar = [];
      await updateHouseholdInDb(household, mutateHousehold);
    }
  };

  const reassignRecipe = async (day) => {
    const randomRecipe = await getRandomRecipe();
    assignRecipeToCalendarDay(
      [{ date: day, recipe: randomRecipe }],
      household,
      mutateHousehold
    );
  };

  const removeRecipe = (day) => {
    assignRecipeToCalendarDay(
      [{ date: day, recipe: null }],
      household,
      mutateHousehold
    );
  };

  const removeAllRecipes = (weekdays) => {
    // Erstellen eines Arrays von Objekten für jede Zutat, die entfernt werden soll
    const assignments = weekdays.map((day) => ({
      date: day.date,
      recipe: null,
    }));

    assignRecipesToCalendarDays(assignments, household, mutateHousehold);
  };

  const checkIfWeekdayIsDefaultEnabled = (date) => {
    return household.settings.weekdaysEnabled[new Date(date).getDay()];
  };

  async function saveNotes(day, notes) {
    await createUserCalenderIfMissing();
    if (household.calendar.some((calendarDay) => calendarDay.date === day)) {
      household.calendar = household.calendar.map((calendarDay) =>
        calendarDay.date === day
          ? { ...calendarDay, notes: notes }
          : calendarDay
      );
    } else {
      console.log("saveNotes-else", day, notes);
      household.calendar.push({
        date: day,
        notes,
      });
    }
    setIsNoteModalActive(false);
    setCalendarDayToEdit(null);
    await updateHouseholdInDb(household, mutateHousehold);
  }

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

  const SortableWeekday = ({ weekday, calendarDay, index }) => {
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
                : household.settings.defaultNumberOfPeople
            }
            changeNumberOfPeople={(change) =>
              changeNumberOfPeople(calendarDay.date, change)
            }
            reassignRecipe={reassignRecipe}
            removeRecipe={removeRecipe}
            day={calendarDay.date}
            $isFavorite={null}
            user={user}
            mutateUser={mutateUser}
            userIsHouseholdAdmin={userIsHouseholdAdmin}
            weekdays={weekdays}
            index={index}
            notes={calendarDay?.notes}
            editNotes={() => {
              setCalendarDayToEdit(calendarDay);
              setIsNoteModalActive(true);
            }}
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
            index={index}
            isDisabled={
              calendarDay?.isDisabled ??
              !checkIfWeekdayIsDefaultEnabled(weekday.date)
                ? "small"
                : ""
            }
            notes={calendarDay?.notes}
            editNotes={() => {
              setCalendarDayToEdit(calendarDay || weekday);
              setIsNoteModalActive(true);
            }}
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

    assignRecipesToCalendarDays(resultArray, household, mutateHousehold);
  }

  if (error || randomRecipesError || householdError) {
    <div>
      <Header text={"Wochenplan"} />
      Daten konnten nicht geladen werden...
    </div>;
  }

  if (isLoading || randomRecipesIsLoading || householdIsLoading) {
    return (
      <>
        <Header text={"Wochenplan"} />
        <LoadingComponent amount />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header text={"Wochenplan"} />
        <CalendarContainer>
          Bitte <Link href="/api/auth/signin">einloggen</Link>, um den
          Wochenplaner zu nutzen.
          <CardSkeleton amount={3} />
        </CalendarContainer>
      </>
    );
  }

  if (!household) {
    return (
      <>
        <Header text={"Wochenplan"} />
        <CalendarContainer>
          Der Haushalt konnte nicht geladen werden. Bitte wähle in den{" "}
          <Link href="/profile/settings">Einstellungen</Link> einen gültigen
          Haushalt aus, auf den du Zugriff hast.
          <CardSkeleton amount={3} />
        </CalendarContainer>
      </>
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
    const newIngredients = [
      ...combinedIngredients.map((ingredient) => ({
        ...ingredient,
        isChecked: false,
      })),
    ];
    if (newIngredients.length === 0) {
      notifyError("Keine Zutaten zur Einkaufsliste hinzugefügt");
      return;
    }

    const uncategorizedIndex = household.shoppingList.findIndex(
      (category) => category.category === "Unsortiert"
    );
    uncategorizedIndex === -1
      ? household.shoppingList.push({
          category: "Unsortiert",
          items: [...newIngredients],
        })
      : household.shoppingList[uncategorizedIndex].items.push(
          ...newIngredients
        );

    updateHouseholdInDb(household, mutateHousehold);
    notifySuccess("Einkaufsliste aktualisiert");
  }
  return (
    <>
      <article>
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

        {userIsHouseholdAdmin && (
          <IconButton
            right="var(--gap-out)"
            top="0.25rem"
            style="Menu"
            rotate={isRandomnessActive}
            onClick={toggleRandomness}
          >
            Anzahl der zufälligen Gerichte
          </IconButton>
        )}
        {isRandomnessActive && (
          <RandomnessSliderContainer>
            {assignableDays.length > 0 ? (
              <p>Planer-Automatik anpassen:</p>
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
            {weekdays && (
              <DietSelectorWrapper>
                <DietSelector
                  dietTypes={dietTypes}
                  onChange={setDietForRandomRecipes}
                  defaultValue={dietForRandomRecipes}
                />
              </DietSelectorWrapper>
            )}
          </RandomnessSliderContainer>
        )}
      </article>

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
                      {userIsHouseholdAdmin && (
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
                          $sliderSize="1rem"
                          index={index}
                        />
                      )}
                      {calendarDay?.isDisabled}
                      {weekday.readableDate}
                    </StyledH2>
                    <SortableWeekday
                      key={weekday.date}
                      weekday={weekday}
                      calendarDay={calendarDay}
                      index={index}
                    />
                    {calendarDay?.notes && (
                      <StyledNotes>{calendarDay.notes}</StyledNotes>
                    )}
                  </Fragment>
                );
              })}
          </SortableContext>
        </DndContext>
      </CalendarContainer>

      {userIsHouseholdAdmin && (
        <IconButtonLarge
          style={"saveShopping"}
          bottom="9rem"
          onClick={saveToShopping}
        />
      )}
      {userIsHouseholdAdmin &&
        (assignableDays.length !== 0 ? (
          <IconButtonLarge
            style={"generate"}
            bottom="5rem"
            onClick={() => {
              populateEmptyWeekdays(
                weekdays,
                assignableDays,
                randomRecipes,
                dietForRandomRecipes,
                numberOfRandomRecipes,
                user,
                household,
                mutateHousehold
              );
            }}
          />
        ) : (
          <IconButtonLarge
            style={"trash"}
            bottom="5rem"
            onClick={() => {
              removeAllRecipes(weekdays);
            }}
          />
        ))}
      {isNoteModalActive && (
        <ModalInput
          toggleModal={() => {
            setIsNoteModalActive(false);
          }}
          defaultVaule={calendarDayToEdit?.notes}
          onSubmit={(e) => {
            e.preventDefault();
            saveNotes(calendarDayToEdit.date, e.target[0].value);
          }}
          btnConfirmMessage="Speichern"
        />
      )}
    </>
  );
}

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
  align-items: space-around;
  gap: 0.5rem;
  position: relative;
`;

const DietSelectorWrapper = styled.div`
  position: relative;
  width: 80%;
  margin: 0 auto;
  select {
    position: absolute;
    right: 0;
  }
`;

const StyledNotes = styled.p`
  margin: 0;
  padding: 0;
  padding-left: var(--gap-between);
  font-size: 0.75rem;
  &::before,
  &::after {
    content: '"';
  }
`;
