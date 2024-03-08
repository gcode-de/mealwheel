import updateUserInDb from "./updateUserInDb";

export default async function assignRecipesToCalendarDays(
  recipeDatePairs,
  user,
  mutateUser
) {
  // Erstellen der Kalendereigenschaft im Benutzerobjekt, falls sie fehlt
  if (!user.calendar) {
    user.calendar = [];
  }

  // Iterieren über jedes Paar von Datum und Rezept-ID im Objekt
  Object.entries(recipeDatePairs).forEach(([dbDate, recipeId]) => {
    if (user.calendar.some((calendarDay) => calendarDay.date === dbDate)) {
      // Rezept zum existierenden Kalendertag hinzufügen
      user.calendar = user.calendar.map((calendarDay) =>
        calendarDay.date === dbDate
          ? {
              ...calendarDay,
              recipe: recipeId,
              isDisabled: recipeId !== null ? false : null,
            }
          : calendarDay
      );
    } else {
      // Neuen Kalendertag mit Rezept hinzufügen
      user.calendar.push({
        date: dbDate,
        recipe: recipeId,
        numberOfPeople: user.settings.defaultNumberOfPeople,
        isDisabled: recipeId !== null ? false : null,
      });
    }
  });
  // Benutzerobjekt in die Datenbank pushen
  await updateUserInDb(user, mutateUser);
}
