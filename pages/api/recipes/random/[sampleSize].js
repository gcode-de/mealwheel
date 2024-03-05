import dbConnect from "../../../../db/connect";
import Recipe from "../../../../db/models/Recipe";

export default async function handler(request, response) {
  await dbConnect();
  const sampleSize = Number(request.query.sampleSize) || 10;

  if (request.method === "GET") {
    try {
      const randomRecipes = await Recipe.aggregate([
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
