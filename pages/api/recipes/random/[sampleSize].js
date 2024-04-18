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

  const sampleSize = Number(request.query.sampleSize) || 10;
  const dietQuery = request.query.diet;

  if (request.method === "GET") {
    try {
      let dietFilter = {};
      if (dietQuery && dietQuery !== "null" && dietQuery !== "undefined") {
        const diets = await expandDietCategories(dietQuery.split(","));
        dietFilter["diet"] = { $in: diets };
      }

      const matchCriteria = {
        $or: [{ public: { $ne: false } }, { public: false, author: userId }],
        ...dietFilter,
        mealtype: { $in: ["main", null, []] },
      };

      const randomRecipes = await Recipe.aggregate([
        { $match: matchCriteria },
        { $sample: { size: sampleSize } },
      ]);

      if (!randomRecipes.length) {
        return response.status(404).json({ status: "Not Found" });
      }

      response.status(200).json(randomRecipes);
    } catch (error) {
      console.error(error);
      response.status(400).json({ error: error.message });
    }
  }
}
