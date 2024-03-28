// pages/api/ai/get-categorization-result.js

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    // Hier Logik zum Abrufen des Ergebnisses der asynchronen Verarbeitung
    // Zum Beispiel aus einer Datenbank abrufen basierend auf einer ID oder einem anderen Identifier
    const result = {
      /* Das Ergebnis der Verarbeitung */
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Fehler beim Abrufen des Ergebnisses:", error);
    return res
      .status(500)
      .json({ message: "Fehler beim Abrufen des Ergebnisses." });
  }
}
