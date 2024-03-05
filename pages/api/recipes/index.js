import dbConnect from "../../../db/connect";
import Recipe from "../../../db/models/Recipe";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    const recipes = await Recipe.find();

    if (!recipes) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(recipes);
  }
  if (request.method === "POST") {
    try {
      const recipes = new Recipe(request.body);
      await recipes.save();
      return response.status(201).json({ status: "Recipe created." });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
