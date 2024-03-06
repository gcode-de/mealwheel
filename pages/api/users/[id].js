import dbConnect from "../../../db/connect";
import User from "../../../db/models/User";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (request.method === "GET") {
    const user = await User.findById(id).populate("recipeInteractions.recipe");

    if (!user) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(user);
  }

  if (request.method === "PUT") {
    const { userId, weekdaysEnabled } = request.body;
    try {
      const user = await User.findByIdAndUpdate(userId);
      user.settings.weekdaysEnabled = weekdaysEnabled;
      await user.save();
      return response.status(200).json("User updated");
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: error.message });
    }
  }
}
