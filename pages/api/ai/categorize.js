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
    const prompt = `Basierend auf den folgenden Zutaten, erstelle eine strukturierte Einkaufsliste als JSON. Die Liste soll in Kategorien unterteilt sein, die ausschließlich aus dieser Liste stammen: ${ingredientCategories.join(
      ", "
    )}.\n\nZutaten: ${JSON.stringify(
      ingredients,
      null,
      2
    )}.\n\nFolge exakt diesem JSON-Format für die Ausgabe: ${JSON.stringify(
      dataSchema,
      null,
      2
    )}.\n\nOrdne die Zutaten den entsprechenden Kategorien zu und kumuliere Mengen von identischen Zutaten. Zutaten, die nicht eindeutig zugeordnet werden können, sollen der Kategorie "Unsortiert" hinzugefügt werden. Die Ausgabe muss ein valides JSON-Array von Objekten sein, ohne zusätzliche Zeichen vor oder nach dem JSON-Array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 4096,
      // response_format: { type: "json_object" },
    });

    console.log("Response from ChatGPT:", response);
    console.log("Response from ChatGPT:", response.choices[0].message.content);

    return res.status(200).json(response.choices[0].message.content);
  } catch (error) {
    console.error("Fehler beim Abrufen der Kategorisierung:", error);
    return res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Kategorisierung" });
  }
}
