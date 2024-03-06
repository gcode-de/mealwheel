export default async function assignRecipesToWeekdays(
  setWeekdays,
  userRecipes,
  randomRecipes,
  numberOfRandomRecipes,
  weekdays,
  user,
  mutateUser
) {
  // Vorbereitung: Identifizieren der bereits zugeordneten Rezepte in den Wochentagen
  const existingRecipeIds = weekdays
    .filter((day) => day.recipe)
    .map((day) => day.recipe);

  // Filtern der Rezepte, um Doppelungen zu vermeiden
  const availableUserRecipes = userRecipes
    .filter(
      (recipe) => !existingRecipeIds.includes(recipe._id) && recipe.hasCooked
    )
    .sort(() => Math.random() - 0.5);

  const availableRandomRecipes = randomRecipes
    .filter((recipe) => !existingRecipeIds.includes(recipe._id))
    .sort(() => Math.random() - 0.5)
    .slice(0, numberOfRandomRecipes);

  // Kombinieren der Rezeptlisten
  const combinedRecipes = [
    ...availableUserRecipes,
    ...availableRandomRecipes,
  ].sort(() => Math.random() - 0.5);

  // Zuweisung der Rezepte zu Wochentagen, die noch kein Rezept haben
  const updatedWeekdays = weekdays.map((day) => {
    if (!day.recipe && combinedRecipes.length > 0) {
      const recipe = combinedRecipes.shift();
      return { ...day, recipe: recipe._id };
    }
    return day;
  });

  // Aktualisierung der UI
  setWeekdays(updatedWeekdays);

  // Vorbereiten der Daten für die Datenbankaktualisierung
  const updatedCalendar = user.calendar.map((calendarDay) => {
    const update = updatedWeekdays.find((day) => day.date === calendarDay.date);
    if (update && update.recipe) {
      return { ...calendarDay, recipe: update.recipe };
    }
    return calendarDay;
  });

  // Ergänzen neuer Kalendereinträge, falls vorhanden
  updatedWeekdays.forEach((day) => {
    if (!user.calendar.find((calendarDay) => calendarDay.date === day.date)) {
      updatedCalendar.push({
        date: day.date,
        recipe: day.recipe,
        isDisabled: false,
        servings: user.settings.defaultNumberOfPeople || 4, // Standardwert falls nicht definiert
      });
    }
  });

  // Aktualisierung der Datenbank
  await fetch(`/api/users/${user._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...user, calendar: updatedCalendar }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("User successfully updated");
        mutateUser(user._id, { ...user, calendar: updatedCalendar }, false);
      } else {
        throw new Error("Failed to update user");
      }
    })
    .catch((error) => console.error("Failed to update user", error));
}
