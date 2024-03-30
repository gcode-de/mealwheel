import dbConnect from "../../../../db/connect";
import User from "../../../../db/models/User";
import Recipe from "../../../../db/models/Recipe";
import Household from "@/db/models/Household";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);
  if (!session) return response.status(403).json({ error: "unauthenticated" });

  await dbConnect();
  const userId = await session.user.id;
  const { id } = request.query;

  if (request.method === "PATCH") {
    try {
      const oldHousehold = await Household.findById(id);

      if (!oldHousehold) {
        return response.status(404).json({ status: "Household not found." });
      }

      if (oldHousehold.members.find((member) => member._id === userId)) {
        await Household.findByIdAndUpdate(id, {
          $pull: { members: { _id: id } },
        });
        return response.status(200).json({ error: "unauthenticated" });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
