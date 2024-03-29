// pages/api/ai/start-categorization.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    // Simuliere das Starten eines asynchronen Prozesses
    process.nextTick(async () => {
      // Hier kommt die Logik, die eigentlich asynchron ausgeführt wird,
      // z.B. der Aufruf an die OpenAI API und das Speichern der Antwort in einer Datenbank
      console.log("Starte asynchrone Verarbeitung...");
      // Beispielhaft warten
      await new Promise((resolve) => setTimeout(resolve, 10000));
      console.log("Asynchrone Verarbeitung abgeschlossen.");
      // Speichere das Ergebnis irgendwo, wo es später abgerufen werden kann
    });

    // Gib sofort eine Antwort zurück, dass die Verarbeitung gestartet wurde
    return res
      .status(202)
      .json({
        message: "Verarbeitung gestartet. Bitte später das Ergebnis abrufen.",
      });
  } catch (error) {
    console.error("Fehler beim Starten der asynchronen Verarbeitung:", error);
    return res
      .status(500)
      .json({ message: "Fehler beim Starten der Verarbeitung." });
  }
}
