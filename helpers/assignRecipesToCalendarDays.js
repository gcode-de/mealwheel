import updateHouseholdInDb from "./updateHouseholdInDb";

export default async function assignRecipesToCalendarDays(
  assignments,
  household,
  mutateHousehold
) {
  // Erstellen der Kalendereigenschaft im Benutzerobjekt, falls sie fehlt
  if (!household.calendar) {
    household.calendar = [];
  }

  // Iterieren über jedes Zuweisungsobjekt im Array
  assignments.forEach(({ date, recipe, servings }) => {
    if (household.calendar.some((calendarDay) => calendarDay.date === date)) {
      // Rezept zum existierenden Kalendertag hinzufügen oder aktualisieren
      household.calendar = household.calendar.map((calendarDay) =>
        calendarDay.date === date
          ? {
              ...calendarDay,
              recipe: recipe,
              // Verwenden der "servings" aus der Zuweisung, falls vorhanden,
              numberOfPeople:
                servings ??
                calendarDay.numberOfPeople ??
                household.settings.defaultNumberOfPeople,
              // isDisabled: recipe !== null ? false : calendarDay.isDisabled,
            }
          : calendarDay
      );
    } else {
      // Neuen Kalendertag mit Rezept und Anzahl der Personen (servings) hinzufügen
      household.calendar.push({
        date: date,
        recipe: recipe,
        numberOfPeople: servings ?? household.settings.defaultNumberOfPeople,
        isDisabled: recipe !== null ? false : null,
      });
    }
  });
  // Benutzerobjekt in die Datenbank pushen
  await updateHouseholdInDb(household, mutateHousehold);
}
