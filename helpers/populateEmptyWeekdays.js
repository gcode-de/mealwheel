import assignRecipeToCalendarDay from "./assignRecipeToDay";

export default async function populateEmptyWeekdays(
  weekdays,
  assignableDays,
  randomRecipes,
  user,
  mutateUser
) {
  const hasCookedRecipes = user?.recipeInteractions
    .filter((recipe) => recipe.hasCooked)
    .map((recipe) => recipe.recipe);

  let recipesInWeek = weekdays.filter(
    (weekday) => weekday?.recipe !== undefined && weekday?.recipe !== null
  );
  // .map((weekday) => weekday.recipe);

  console.log(recipesInWeek);

  //assignRecipeToCalendarDay(recipeId, dayDate, user, mutateUser);
  //pushRecipe to recipesInWeek
}
