// export default async function fetchCategorizedIngredients(ingredients) {
//   const response = await fetch(`/api/ai/categorize`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ ingredients }),
//   });

//   if (!response.ok) {
//     if (response.status === 504) {
//       throw new Error(
//         "504: Die KI antwortet nicht schnell genug. Bitte versuche es zu einem späteren Zeitpunkt."
//       );
//     } else {
//       throw new Error("Fehler beim Abrufen der kategorisierten Zutaten");
//     }
//   }

//   const data = await response.json();
//   return data;
// }

export default async function fetchCategorizedIngredients(ingredients) {
  try {
    const response = await fetch(`/api/ai/categorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      // Behandle spezifische Fehlercodes
      if (response.status === 504) {
        throw new Error(
          "504: Die KI antwortet nicht schnell genug. Bitte versuche es zu einem späteren Zeitpunkt."
        );
      } else {
        throw new Error("Fehler beim Abrufen der kategorisierten Zutaten");
      }
    }

    // Da das Backend nun den Stream verarbeitet und ein fertiges JSON-Objekt zurückgibt,
    // können wir dieses Objekt direkt mit response.json() extrahieren.
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
    throw error; // Weitergabe des Fehlers für die Fehlerbehandlung in der aufrufenden Komponente
  }
}
