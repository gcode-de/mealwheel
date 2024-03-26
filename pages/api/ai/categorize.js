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
        { name: "Vollkornbrot", quantity: 1, unit: "Laib", isChecked: false },
      ],
    },
  ];

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ message: "Zutaten sind erforderlich" });
  }

  try {
    const prompt = `Ordne diese Zutaten passenden Kategorien zu: ${ingredients}.\n
    Verwende nur diese Kategorien: '${ingredientCategories.join(
      ","
    )}' und zwar jeweils maxmal ein mal.\n
    Beachte dabei vor allem den Namen der Zutat und weniger die anderen Eigenschaften.\n
    Behalte für Zutaten, die du nicht eindeutig zuordnen kannst, einfach die Kategorie "Unsortiert".\n
    Kumuliere Zutaten, die mehrfach auftauchen, indem du die Quantity addierst.\n
    Gib mir das Ergebnis nur als Array aus Objekten zurück nach dem Schema "${JSON.stringify(
      dataSchema
    )}".\n
    Stelle sicher, dass ich deine Antwort direkt als JSON parsen kann und dass das Array am Ende vollständig abgeschlossen ist.\n
    Gibt NICHT am Anfang deiner Antwort "Json", Anführungszeichen oder Backticks aus.`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      // model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 500,
    });
    console.log("response in API:\n", response.choices[0].message.content);

    return res.status(200).json(response.choices[0].message.content);
  } catch (error) {
    console.error("Fehler beim Abrufen der Kategorisierung:", error);
    return res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Kategorisierung" });
  }
}
