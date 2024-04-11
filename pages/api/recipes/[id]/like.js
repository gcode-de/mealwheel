import dbConnect from "../../../../db/connect";
import Recipe from "../../../../db/models/Recipe";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request, response) {
  await dbConnect();

  const session = await getServerSession(request, response, authOptions);

  if (!session) {
    return response
      .status(401)
      .json({ error: "You must be logged in to perform this action." });
  }

  if (request.method === "PUT") {
    const { id } = request.query;
    const { likeChange } = request.body;

    // if (![1, -1].includes(likeChange)) {
    //   return response.status(400).json({ error: "Invalid like change value." });
    // }
    //the code above was disabled for the "synchronize likes" function on admin page to work.

    try {
      const recipe = await Recipe.findById(id);

      if (!recipe) {
        return response.status(404).json({ status: "Recipe not found." });
      }

      // Aktualisiert die Anzahl der Likes basierend auf dem Wert in likeChange
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        id,
        { $inc: { likes: likeChange } }, // inkrementiert oder dekrementiert die likes
        { new: true } // gibt das aktualisierte Dokument zurück
      );

      if (!updatedRecipe) {
        return response.status(404).json({ status: "Unable to update likes." });
      }

      return response
        .status(200)
        .json({ status: "Likes updated.", recipe: updatedRecipe });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  } else {
    return response.status(405).json({ error: "Method not allowed" });
  }
}
