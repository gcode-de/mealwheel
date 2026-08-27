import dbConnect from "../../../db/connect";
import User from "../../../db/models/User";
import Recipe from "../../../db/models/Recipe";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    let usersQuery = User.find().select(
      "userName _id profilePictureLink connectionRequests friends collections recipeInteractions lastLogin"
    );

    if (request.query.include === "collections") {
      usersQuery = usersQuery.populate("collections.recipes");
    }

    const users = await usersQuery;

    if (!users) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(users);
  }
}
