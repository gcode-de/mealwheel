import OpenAI from "openai";

export default async function categorizeIngredients(ingredients) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Kategorisiere diese Zutaten:\n\n" + ingredients.join("\n"),
    temperature: 0.7,
    max_tokens: 100,
  });

  const categories = response.choices[0].text
    .split("\n")
    .map((category) => category.trim());
  return categories;
}

const ingredients = ["Kartoffeln", "Zwiebeln", "Möhren", "Milch", "Eier"];

const categories = await categorizeIngredients(ingredients);

console.log(categories);
