import dbConnect from "../../../db/connect";
import User from "../../../db/models/User";
import Recipe from "../../../db/models/Recipe";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (request.method === "GET") {
    let user = await User.findById(id)
      .populate("recipeInteractions.recipe")
      .populate("calendar.recipe");
    console.log(user);

    // if (!user) {
    //   return response.status(404).json({ status: "Not Found" });
    // }

    if (!user) {
      user = await User.create({
        _id: id,
        calendar: [],
        recipeInteractions: [],
        settings: {},
      });
    }

    response.status(200).json(user);
  }

  if (request.method === "PUT") {
    try {
      await User.findByIdAndUpdate(id, request.body);
      return response.status(200).json("User updated");
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: error.message });
    }
  }
}
