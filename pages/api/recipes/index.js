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

  //   if (request.method === "PUT") {
  //     try {
  //       await Recipe.findByIdAndUpdate(id, request.body);
  //       return response.status(200).json("Recipe updated");
  //     } catch (error) {
  //       console.log(error);
  //       response.status(400).json({ error: error.message });
  //     }
  //   }

  //   if (request.method === "DELETE") {
  //     try {
  //       await Recipe.findByIdAndDelete(id);
  //       return response.status(200).json("Recipe deleted");
  //     } catch (error) {
  //       console.log(error);
  //       response.status(400).json({ error: error.message });
  //     }
  //   }
}
