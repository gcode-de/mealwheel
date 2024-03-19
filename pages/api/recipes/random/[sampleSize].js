import dbConnect from "../../../../db/connect";
import Recipe from "../../../../db/models/Recipe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request, response) {
  await dbConnect();
  const session = await getServerSession(request, response, authOptions);
  const userId = session.user.id;

  const sampleSize = Number(request.query.sampleSize) || 10;

  if (request.method === "GET") {
    try {
      const randomRecipes = await Recipe.aggregate([
        {
          $match: {
            $or: [
              { public: { $ne: false } }, // Rezept ist öffentlich oder hat keine public-Property
              { public: false, author: userId }, // Rezept ist nicht öffentlich, aber gehört dem User
            ],
          },
        },
        { $sample: { size: sampleSize } },
      ]);

      if (!randomRecipes) {
        return response.status(404).json({ status: "Not Found" });
      }

      response.status(200).json(randomRecipes);
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: error.message });
    }
  }
}
