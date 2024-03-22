import updateUserInDb from "./updateUserInDb";

export default async function assignRecipesToCalendarDays(
  assignments,
  user,
  mutateUser
) {
  // Erstellen der Kalendereigenschaft im Benutzerobjekt, falls sie fehlt
  if (!user.calendar) {
    user.calendar = [];
  }

  // Iterieren über jedes Zuweisungsobjekt im Array
  assignments.forEach(({ date, recipe, servings }) => {
    if (user.calendar.some((calendarDay) => calendarDay.date === date)) {
      // Rezept zum existierenden Kalendertag hinzufügen oder aktualisieren
      user.calendar = user.calendar.map((calendarDay) =>
        calendarDay.date === date
          ? {
              ...calendarDay,
              recipe: recipe,
              // Verwenden der "servings" aus der Zuweisung, falls vorhanden,
              numberOfPeople:
                servings ??
                calendarDay.numberOfPeople ??
                user.settings.defaultNumberOfPeople,
              isDisabled: recipe !== null ? false : calendarDay.isDisabled,
            }
          : calendarDay
      );
    } else {
      // Neuen Kalendertag mit Rezept und Anzahl der Personen (servings) hinzufügen
      user.calendar.push({
        date: date,
        recipe: recipe,
        numberOfPeople: servings ?? user.settings.defaultNumberOfPeople,
        isDisabled: recipe !== null ? false : null,
      });
    }
  });

  // Benutzerobjekt in die Datenbank pushen
  await updateUserInDb(user, mutateUser);
}
