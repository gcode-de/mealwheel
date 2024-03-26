export default async function fetchCategorizedIngredients(ingredients) {
  const response = await fetch(`/api/ai/categorize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Abrufen der kategorisierten Zutaten");
  }

  const data = await response.json();
  return data;
}
