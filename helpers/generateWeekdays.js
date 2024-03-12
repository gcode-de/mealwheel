export default function generateWeekdays(weekOffset) {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0); // Setzt die Zeit auf Mitternacht UTC
  now.setDate(now.getDate() + weekOffset * 7); // Verschiebt das Datum um die Anzahl der Wochen, die durch weekOffset angegeben sind.

  // Korrektur, um sicherzustellen, dass die Woche mit Montag beginnt
  const dayOfWeek = now.getUTCDay(); // Sonntag = 0, Montag = 1, ..., Samstag = 6
  let startOfWeek = now.getUTCDate() - ((dayOfWeek + 6) % 7); // Anpassung, um Montag als ersten Tag zu setzen

  const weekdays = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), startOfWeek + index)
    );
    const dateString = day.toISOString(); // Erstellt einen ISO-String mit UTC-Mitternacht

    return {
      readableDate: day.toLocaleDateString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      servings: 4,
      isDisabled: false,
      recipe: null,
      date: dateString, // ISO-String mit Zeitstempel um Mitternacht UTC
    };
  });
  return weekdays;
}
