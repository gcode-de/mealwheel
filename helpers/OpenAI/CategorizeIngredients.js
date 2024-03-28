export default async function fetchCategorizedIngredients(ingredients) {
  const response = await fetch(`/api/ai/categorize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });

  if (!response.ok) {
    if (response.status === 504) {
      throw new Error(
        "504: Die KI antwortet nicht schnell genug. Bitte versuche es zu einem späteren Zeitpunkt."
      );
    } else {
      throw new Error("Fehler beim Abrufen der kategorisierten Zutaten");
    }
  }

  const data = await response.json();
  return data;
}
