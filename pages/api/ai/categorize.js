import { OpenAI } from "openai";

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
    // const prompt = `Kategorisiere diese Zutaten: ${ingredients.join(
    //   ", "
    // )}. Gibt mir jeweils die Kategorie und nach einem Doppelpunkt die passenden Zutaten, getrennt durch Kommas.`;
    const prompt = `Kategorisiere diese Zutaten: ${ingredients.join(
      ", "
    )}. Gib mir das Ergebnis als Objekt zurück nach dem Schema {Kategorie1:["Zutat1","Zutat2"],Kategorie2:["Zutat3","Zutat4"]}`;
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
