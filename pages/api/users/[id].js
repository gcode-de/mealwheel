import dbConnect from "../../../db/connect";
import User from "../../../db/models/User";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;
  if (request.method === "PATCH") {
    try {
      const user = await User.findById(id);

      if (!user) {
        return response
          .status(404)
          .json({ status: "User not found or unauthorized" });
      }
      console.log("test", response);
      await User.findByIdAndUpdate(id, request.body);
      return response.status(200).json({ status: `User ${id} updated!` });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
