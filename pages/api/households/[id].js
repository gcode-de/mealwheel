import dbConnect from "../../../db/connect";
import User from "../../../db/models/User";
import Recipe from "../../../db/models/Recipe";
import Household from "@/db/models/Household";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);
  if (!session) return response.status(403).json({ error: "unauthenticated" });

  await dbConnect();

  const { id } = request.query;
  console.log(request.query);

  if (request.method === "GET") {
    const household = await Household.findById(id).populate("calendar.recipe");

    if (!household) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(household);
  }

  if (request.method === "PATCH") {
    try {
      const household = await Household.findById(id);

      if (!household) {
        return response
          .status(404)
          .json({ status: "Household not found or unauthorized" });
      }

      await Household.findByIdAndUpdate(id, request.body);
      return response.status(200).json({ status: `Household ${id} updated!` });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}