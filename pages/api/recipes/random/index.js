import dbConnect from "../../../../db/connect";
import Recipe from "../../../../db/models/Recipe";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { expandDietCategories } from "../../../../helpers/filterTags";

export default async function handler(request, response) {
  await dbConnect();
  const session = await getServerSession(request, response, authOptions);
  const userId = session?.user?.id
    ? new mongoose.Types.ObjectId(session.user.id)
    : null;

  const dietQuery = request.query.diet;
  const mealtypeQuery = request.query.mealtype || "main"; // default to "main" if not specified

  try {
    let dietFilter = {};
    if (dietQuery) {
      const diets = await expandDietCategories(dietQuery.split(","));
      dietFilter["diet"] = { $in: diets };
    }

    const matchCriteria = {
      $or: [
        { public: { $ne: false } }, // Das Rezept ist öffentlich oder hat keine public-Property
        { author: userId }, // Der Benutzer ist der Autor des Rezepts
      ],
      ...dietFilter,
      mealtype: { $in: [mealtypeQuery, null, []] }, // mealtype ist leer oder enthält den angefragten Typ
    };

    const randomRecipes = await Recipe.aggregate([
      { $match: matchCriteria },
      { $sample: { size: 1 } }, // Zufälliges Rezept zurückgeben
    ]);

    if (!randomRecipes.length) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(randomRecipes[0]); // Return the first random recipe
  } catch (error) {
    console.error(error);
    response.status(400).json({ error: error.message });
  }
}
