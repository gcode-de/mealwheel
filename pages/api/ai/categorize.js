import { OpenAI } from "openai";
import { ingredientCategories } from "@/helpers/ingredientCategories";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Nur POST-Anfragen sind erlaubt" });
  }

  const { ingredients } = req.body;
  const dataSchema = [
    {
      category: "Obst & Gemüse",
      items: [
        { name: "Äpfel", quantity: 5, unit: "Stück", isChecked: false },
        { name: "Tomaten", quantity: 1, unit: "kg", isChecked: false },
      ],
    },
    {
      category: "Backwaren",
      items: [
        { name: "Vollkornbrot", quantity: 1, unit: "kg", isChecked: false },
      ],
    },
  ];

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ message: "Zutaten sind erforderlich" });
  }

  try {
    // const prompt = `Ordne diese Zutaten einer Einkaufsliste passenden Kategorien zu: ${ingredients}.\n
    // Verwende nur diese Kategorien: '${ingredientCategories.join(
    //   ","
    // )}' und zwar jeweils maxmal ein mal.\n
    // Beachte dabei vor allem den Namen der Zutat und weniger die anderen Eigenschaften.\n
    // Behalte für Zutaten, die du nicht eindeutig zuordnen kannst, einfach die Kategorie "Unsortiert".\n
    // Kumuliere Zutaten, die mehrfach auftauchen, indem du die Quantity addierst.\n
    // Gib mir das Ergebnis nur vollständiges JSON zurück - als Array aus Objekten zurück nach diesem Schema: "${JSON.stringify(
    //   dataSchema
    // )}".\n
    // Stelle absolut sicher, dass ich deine Antwort direkt als JSON parsen kann und dass das Array am Ende vollständig abgeschlossen ist.\n
    // Gibt NICHT am Anfang deiner Antwort "Json", Anführungszeichen oder Backticks aus.\n
    // Vorgehensweise: 1) Erstelle für jede der Kategorien ein Objekt mit den Properties "category: NAME_DER_KATEGORIE" und "items: []"\n
    // 2) füge den Items-Arrays der Kategorien nacheinander die vorhandenen Item-Objekte hinzu.\n
    // 3)Fasse am Ende alle Kategorie-Objekte mit innenliegenden Items-Arrays einem gemeinsamen Array hinzu, das du mir als valides JSON zurück gibst.`;

    const prompt = `Basierend auf den folgenden Zutaten, erstelle eine strukturierte Einkaufsliste als JSON. Die Liste soll in Kategorien unterteilt sein, die ausschließlich aus dieser Liste stammen: ${ingredientCategories.join(
      ", "
    )}.\n\nZutaten: ${ingredients.join(
      ", "
    )}.\n\nFolge exakt diesem JSON-Format für die Ausgabe: ${JSON.stringify(
      dataSchema,
      null,
      2
    )}.\n\nOrdne die Zutaten den entsprechenden Kategorien zu und kumuliere Mengen von identischen Zutaten. Zutaten, die nicht eindeutig zugeordnet werden können, sollen der Kategorie "Unsortiert" hinzugefügt werden. Die Ausgabe muss ein valides JSON-Array von Objekten sein, ohne zusätzliche Zeichen vor oder nach dem JSON-Array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      // model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 4096,
    });

    console.log("Response ChatGPT:", response);

    return res.status(200).json(response.choices[0].message.content);
  } catch (error) {
    console.error("Fehler beim Abrufen der Kategorisierung:", error);
    return res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Kategorisierung" });
  }
}
