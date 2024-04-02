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

  if (request.method === "GET") {
    const household = await Household.findById(id).populate("calendar.recipe");

    if (!household) {
      return response.status(404).json({ status: "Not Found" });
    }

    const member = household.members.find(
      (member) => String(member._id) === userId
    );

    if (!member) {
      return response.status(403).json({ error: "unauthenticated" });
    }

    response.status(200).json(household);
  }

  if (request.method === "PUT") {
    try {
      const oldHousehold = await Household.findById(id);

      if (!oldHousehold) {
        return response.status(404).json({ status: "Household not found." });
      }

      const member = oldHousehold.members.find(
        (member) => String(member._id) === userId
      );

      if (!member || (member.role !== "owner" && member.role !== "canWrite")) {
        return response.status(403).json({ error: "unauthenticated" });
      }

      await Household.findByIdAndUpdate(id, request.body);
      return response.status(200).json({ status: `Household ${id} updated!` });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
