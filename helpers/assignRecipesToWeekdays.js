export default async function assignRecipesToWeekdays(
  setWeekdays,
  userRecipes,
  randomRecipes,
  numberOfRandomRecipes,
  weekdays,
  user
) {
  // Mischen der Rezepte für eine zufällige Auswahl
  const mixedRandomRecipes = [...randomRecipes].sort(() => 0.5 - Math.random());
  const mixedUserRecipes = [...userRecipes].sort(() => 0.5 - Math.random());

  // Berechnen, wie viele Rezepte von jedem Typ verwendet werden sollen
  let randomRecipesToUse = numberOfRandomRecipes;
  let userRecipesToUse = Math.max(0, 7 - randomRecipesToUse); // Sicherstellen, dass die Anzahl nicht negativ ist

  // Anpassen, falls nicht genug userRecipes vorhanden sind
  if (userRecipesToUse > userRecipes.length) {
    userRecipesToUse = userRecipes.length;
    randomRecipesToUse = Math.max(0, 7 - userRecipesToUse);
  }

  // Auswahl der Rezepte
  const selectedRandomRecipes = mixedRandomRecipes.slice(0, randomRecipesToUse);
  const selectedUserRecipes = mixedUserRecipes.slice(0, userRecipesToUse);

  // Kombinieren und Mischen der ausgewählten Rezepte
  const combinedRecipes = [
    ...selectedUserRecipes,
    ...selectedRandomRecipes,
  ].sort(() => 0.5 - Math.random());

  // Prüfen und aktualisieren des Benutzerkalenders
  const updatedCalendar = weekdays.map((weekday, index) => {
    const existingDay = user.calendar.find(
      (calendarDay) =>
        new Date(calendarDay.date).toISOString().slice(0, 10) ===
        weekday.date.toISOString().slice(0, 10)
    );

    return existingDay
      ? { ...existingDay, recipe: combinedRecipes[index] ?? existingDay.recipe }
      : {
          date: weekday.date,
          recipe: combinedRecipes[index],
          isDisabled: false,
          servings: user.settings.defaultNumberOfPeople,
        };
  });

  // Setzen der aktualisierten Wochentage im Zustand
  setWeekdays(
    weekdays.map((weekday) => {
      const dayUpdate = updatedCalendar.find(
        (calendarDay) =>
          new Date(calendarDay.date).toISOString().slice(0, 10) ===
          weekday.date.toISOString().slice(0, 10)
      );

      return dayUpdate ? { ...weekday, ...dayUpdate } : weekday;
    })
  );

  //Update Database
  const response = await fetch(`/api/users/${user._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...user,
      calendar: [...user.calendar, ...updatedCalendar],
    }),
  });
  if (response.ok) {
    // Rufen Sie hier mutateUser auf, falls mutateUser eine Funktion ist, die den Benutzerzustand aktualisiert
    // mutateUser();
    console.log("User successfully updated");
  } else {
    console.error("Failed to update user");
  }
}
