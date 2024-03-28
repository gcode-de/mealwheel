import assignRecipesToCalendarDays from "./assignRecipesToCalendarDays";

export default async function populateEmptyWeekdays(
  weekdays,
  assignableDays,
  randomRecipes,
  numberOfRandomRecipes,
  user,
  household,
  mutateHousehold
) {
  // Erstellen der Kalendereigenschaft im Benutzerobjekt, falls sie fehlt
  if (!household.calendar) {
    household.calendar = [];
  }

  const hasCookedRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.hasCooked && recipe.isFavorite)
    .map((recipe) => recipe.recipe);

  //find all recipes that all already planned for the week to avoid them
  let recipesInWeek = weekdays
    .filter((weekday) => {
      const calendarDay = household.calendar.find(
        (day) => day.date === weekday.date
      );
      return (
        calendarDay?.isDisabled === false &&
        calendarDay?.recipe !== undefined &&
        calendarDay?.recipe !== null
      );
    })
    .map(
      (weekday) =>
        household.calendar.find((day) => day.date === weekday.date).recipe._id
    );

  //create an Array "mixedRecipes" that includes recipes from "randomRecipes" and "householdRecipes".
  //The final length of the array should be equal to "assignableDays.length".
  //It should contain "numberOfRandomRecipes" random recipes and the rest should be picked from "householdRecipes".
  //If there are not enough householdRecipes, use mor random recipes.
  //When adding each recipe to the array, check if the recipe is already contained in "recipesInWeek". If that's the case, chose the next rcipe from the array you are currently picking from, to avoid having the same recipe more then once in one week.

  // Mischung aus zufälligen Rezepten und Rezepten, die vom Benutzer gekocht wurden
  let indexRandom = 0;
  let indexCooked = 0;
  let combinedRecipes = [];
  const maxDaysForCookedRecipes = assignableDays.length - numberOfRandomRecipes;

  while (
    indexCooked < hasCookedRecipes.length &&
    combinedRecipes.length < maxDaysForCookedRecipes
  ) {
    if (!recipesInWeek.includes(hasCookedRecipes[indexCooked]._id)) {
      combinedRecipes.push({
        recipe: hasCookedRecipes[indexCooked],
        date: assignableDays[combinedRecipes.length],
      });
    }
    indexCooked++;
  }

  while (
    indexRandom < randomRecipes.length &&
    combinedRecipes.length < assignableDays.length
  ) {
    if (!recipesInWeek.includes(randomRecipes[indexRandom]._id)) {
      combinedRecipes.push({
        recipe: randomRecipes[indexRandom],
        date: assignableDays[combinedRecipes.length],
      });
    }
    indexRandom++;
  }

  shuffleArray(combinedRecipes);

  // Bereite die neuen Assignments vor, wobei jedes Objekt 'date', 'recipe' und optional 'servings' enthält
  const recipeAssignments = combinedRecipes.map(({ recipe, date }) => ({
    date: date,
    recipe: recipe._id,
  }));

  assignRecipesToCalendarDays(recipeAssignments, household, mutateHousehold);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
