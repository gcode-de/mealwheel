import assignRecipeToCalendarDay from "./assignRecipeToDay";

export default async function populateEmptyWeekdays(
  weekdays,
  assignableDays,
  randomRecipes,
  user,
  mutateUser
) {
  // Erstellen der Kalendereigenschaft im Benutzerobjekt, falls sie fehlt
  if (!user.calendar) {
    user.calendar = [];
  }

  const hasCookedRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.hasCooked)
    .map((recipe) => recipe.recipe);

  //find all recipes that all already planned fr the week to avoid them
  let recipesInWeek = weekdays
    .filter((weekday) => {
      const calendarDay = user.calendar.find(
        (day) => day.date === weekday.date
      );
      return (
        calendarDay.isDisabled === false &&
        calendarDay.recipe !== undefined &&
        calendarDay.recipe !== null
      );
    })
    .map(
      (weekday) =>
        user.calendar.find((day) => day.date === weekday.date).recipe._id
    );

  console.log(recipesInWeek);

  //   assignRecipeToCalendarDay(recipeId, dayDate, user, mutateUser);
}
