import dbConnect from "../../../../db/connect";
import User from "../../../../db/models/User";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);
  if (!session) {
    return response.status(403).json({ error: "unauthenticated" });
  }
  await dbConnect();

  const userId = session.user.id;
  const { id } = request.query;
  if (request.method === "PATCH") {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return response.status(404).json({ status: "User not found." });
      }

      await User.findByIdAndUpdate(id, {
        $pull: { friends: userId },
      });

      return response
        .status(200)
        .json({ status: `Friend ${id} removed from user ${userId}.` });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
