import dbConnect from "../../../db/connect";
import User from "../../../db/models/User";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    const users = await User.find().select(
      "userName _id profilePictureLink connectionRequests friends"
    );

    if (!users) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(users);
  }
}
