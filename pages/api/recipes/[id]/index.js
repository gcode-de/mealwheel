import dbConnect from "../../../../db/connect";
import Recipe from "../../../../db/models/Recipe";
import mongoose from "mongoose";
import { cleanupRecipeReferences } from "../../../../db/models/Recipe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request, response) {
  await dbConnect();
  const session = await getServerSession(request, response, authOptions);
  const userId = session?.user?.id
    ? new mongoose.Types.ObjectId(session.user.id)
    : null;
  const { id } = request.query;

  if (request.method === "GET") {
    const recipe = await Recipe.findById(id);

    if (!recipe || (!recipe.author.equals(userId) && recipe.public === false)) {
      return response
        .status(404)
        .json({ status: "Recipe not found or unauthorized" });
    }

    response.status(200).json(recipe);
  } else if (request.method === "PUT") {
    try {
      const recipe = await Recipe.findById(id);

      if (!recipe || !recipe.author.equals(userId)) {
        return response
          .status(404)
          .json({ status: "Recipe not found or unauthorized" });
      }

      await Recipe.findByIdAndUpdate(id, request.body);
      return response.status(200).json({ status: `Recipe ${id} updated!` });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  } else if (request.method === "DELETE") {
    try {
      const recipe = await Recipe.findById(id);

      if (!recipe || !recipe.author.equals(userId)) {
        return response
          .status(404)
          .json({ status: "Recipe not found or unauthorized" });
      }

      await Recipe.findByIdAndDelete(id);
      return response.status(200).json({ status: `Recipe ${id} deleted!` });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
