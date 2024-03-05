export default function generateWeekdays(weekOffset) {
  const weekdays = [];
  const today = new Date();
  const mondayOffset = today.getDay() === 0 ? 6 : today.getDay() - 1; // Korrektur, um Montag als ersten Tag der Woche zu setzen
  const monday = new Date(
    today.setDate(today.getDate() - mondayOffset + weekOffset * 7)
  );

  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const options = { weekday: "short", month: "short", day: "numeric" };
    const readableDate = `${day.toLocaleDateString("de-DE", options)}`;
    weekdays.push({
      date: day,
      servings: 4,
      isDisabled: false,
      recipe: null,
      readableDate,
    });
  }
  return weekdays;
}
