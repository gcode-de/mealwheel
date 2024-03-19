import assignRecipeToCalendarDay from "./assignRecipeToDay";

export default async function populateEmptyWeekdays(
  weekdays,
  assignableDays,
  randomRecipes,
  numberOfRandomRecipes,
  user,
  mutateUser
) {
  // Erstellen der Kalendereigenschaft im Benutzerobjekt, falls sie fehlt
  if (!user.calendar) {
    user.calendar = [];
  }

  const hasCookedRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.hasCooked && recipe.isFavorite)
    .map((recipe) => recipe.recipe);

  //find all recipes that all already planned fr the week to avoid them
  let recipesInWeek = weekdays
    .filter((weekday) => {
      const calendarDay = user.calendar.find(
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
        user.calendar.find((day) => day.date === weekday.date).recipe._id
    );

  //create an Array "mixedRecipes" that includes recipes from "randomRecipes" and "userRecipes".
  //The final length of the array should be equal to "assignableDays.length".
  //It should contain "numberOfRandomRecipes" random recipes and the rest should be picked from "userRecipes".
  //If there are not enough userRecipes, use mor random recipes.
  //When adding each recipe to the array, check if the recipe is already contained in "recipesInWeek". If that's the case, chose the next rcipe from the array you are currently picking from, to avoid having the same recipe more then once in one week.
  // Mischung aus zufälligen Rezepten und Rezepten, die vom Benutzer gekocht wurden

  let indexRandom = 0;
  let indexCooked = 0;
  let combinedRecipes = [];
  const maxDaysForCookedRecipes = assignableDays.length - numberOfRandomRecipes;

  // Füge zuerst Rezepte hinzu, die der Benutzer gekocht hat, bis das Limit erreicht ist
  // oder keine weiteren benötigt werden
  while (
    indexCooked < hasCookedRecipes.length &&
    combinedRecipes.length < maxDaysForCookedRecipes
  ) {
    if (!recipesInWeek.includes(hasCookedRecipes[indexCooked]._id)) {
      combinedRecipes.push(hasCookedRecipes[indexCooked]);
    }
    indexCooked++;
  }

  // Füge dann zufällige Rezepte hinzu, bis das Gesamtlimit erreicht ist
  while (
    indexRandom < randomRecipes.length &&
    combinedRecipes.length < assignableDays.length
  ) {
    if (!recipesInWeek.includes(randomRecipes[indexRandom]._id)) {
      combinedRecipes.push(randomRecipes[indexRandom]);
    }
    indexRandom++;
  }

  shuffleArray(combinedRecipes);

  const recipeAssignments = assignableDays.reduce((assignments, day, index) => {
    if (index < combinedRecipes.length) {
      assignments[day] = combinedRecipes[index]._id;
    }
    return assignments;
  }, {});

  assignRecipeToCalendarDay(recipeAssignments, user, mutateUser);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
