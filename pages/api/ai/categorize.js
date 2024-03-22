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
  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ message: "Zutaten sind erforderlich" });
  }

  try {
    const prompt = `Ordne diese Zutaten passenden Kategorien zu: ${ingredients}.\n
    Verwende nur diese Kategorien: '${ingredientCategories.join(
      ","
    )}' und zwar jeweils maxmal ein mal.\n
    Gib mir das Ergebnis als Array aus Objekten zurück nach dem Schema [{name: "Name_der_Zutat", category: "Kategorie_der_Zutat", quantity:"Menge_der_Zutat",unit:"Einheit_der_Menge"}, ...]`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
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
