import updateHouseholdInDb from "./updateHouseholdInDb";

export default async function assignRecipesToCalendarDays(
  assignments,
  household,
  mutateHousehold
) {
  let calendar = [...(household.calendar || [])];

  // Iterieren über jedes Zuweisungsobjekt im Array
  assignments.forEach(({ date, recipe, servings }) => {
    if (calendar.some((calendarDay) => calendarDay.date === date)) {
      // Rezept zum existierenden Kalendertag hinzufügen oder aktualisieren
      calendar = calendar.map((calendarDay) =>
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
      calendar = [
        ...calendar,
        {
          date: date,
          recipe: recipe,
          numberOfPeople:
            servings ?? household.settings.defaultNumberOfPeople,
          isDisabled: recipe !== null ? false : null,
        },
      ];
    }
  });
  const updatedHousehold = { ...household, calendar };
  await updateHouseholdInDb(updatedHousehold, mutateHousehold);
  return updatedHousehold;
}
