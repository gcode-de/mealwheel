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

      //delete requests from user
      if (request.body.type === null) {
        await User.findByIdAndUpdate(id, {
          $pull: { connectionRequests: { senderId: request.body.senderId } },
        });
        return response
          .status(200)
          .json({ status: `Requests from ${userId} to ${id} removed!` });

        //request from this is already exists
      }
      // else if (
      //   user.connectionRequests.some(
      //     (req) => String(req.senderId) === String(request.body.senderId)
      //   )
      // ) {
      //   return response.status(403).json({ status: "No spam allowed!" });
      // }

      //add request to user
      await User.findByIdAndUpdate(id, {
        $push: { connectionRequests: request.body },
      });
      return response.status(200).json({ status: `Request for ${id} added!` });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
