import dbConnect from "../../../db/connect";
import Recipe from "../../../db/models/Recipe";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (request.method === "GET") {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(recipe);
  }

  if (request.method === "PUT") {
    const recipe = request.body;
    await Recipe.findByIdAndUpdate(id, recipe);
    return response.status(200).json({ status: `Recipe ${id} updated!` });
  }

  if (request.method === "DELETE") {
    const { user, author } = request.body;
    console.log(user, author);
    if (user === author) {
      await Recipe.findOneAndDelete(id);
      return response.status(200).json({ status: `Recipe ${id} updated!` });
    } else {
      return response.status(401).json({ status: "unathorized" });
    }
  }
}
