import dbConnect from "../../../../db/connect";
import User from "../../../../db/models/User";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);
  if (!session) return response.status(403).json({ error: "unauthenticated" });
  await dbConnect();

  const userId = session.user.id;

  const { id } = request.query;
  if (request.method === "PATCH") {
    try {
      const user = await User.findById(id);

      if (!user) {
        return response.status(404).json({ status: "User not found." });
      }

      if (request.body === null) {
        //delete requests from user
        await User.findByIdAndUpdate(userId, {
          $pull: { connectionRequests: { senderId: id } },
        });
        return response
          .status(200)
          .json({ status: `Request for ${id} added!` });
      } else if (
        //request from this is alrwady exists
        user.connectionRequests.some(
          (req) => String(req.senderId) === String(request.body.senderId)
        )
      ) {
        return response.status(403).json({ status: "No spam allowed!" });
      }

      await User.findByIdAndUpdate(id, {
        //add request to user
        $push: { connectionRequests: request.body },
      });
      return response.status(200).json({ status: `Request for ${id} added!` });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
