import updateUserinDb from "./updateUserInDb";

export default async function assignRecipeToCalendarDay(
  recipeId,
  dbDate,
  user,
  mutateUser
) {
  //create calendar property in user object if missing
  if (!user.calendar) {
    user.calendar = [];
    await updateUserinDb();
  }

  //add recipe to calendarDay in user object
  if (user.calendar.some((calendarDay) => calendarDay.date === dbDate)) {
    user.calendar = user.calendar.map((calendarDay) =>
      calendarDay.date === dbDate
        ? { ...calendarDay, recipe: recipeId }
        : calendarDay
    );
  } else {
    user.calendar.push({
      date: dbDate,
      recipe: recipeId,
      numberOfPeople: user.settings.defaultNumberOfPeople,
    });
  }

  //set day to !isDisabled if recipe provided
  if (recipeId !== null) {
    user.calendar = user.calendar.map((calendarDay) =>
      calendarDay.date === dbDate
        ? { ...calendarDay, isDisabled: false }
        : calendarDay
    );
  }

  //push user object to database
  await updateUserinDb(user, mutateUser);
}
