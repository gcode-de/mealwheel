import dbConnect from "../../../../db/connect";
import User from "../../../../db/models/User";
import Household from "@/db/models/Household";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);
  if (!session) return response.status(403).json({ error: "unauthenticated" });

  await dbConnect();
  const sessionUserId = await session.user.id;
  const { id: householdId } = request.query;
  const { userId } = request.body;

  if (request.method !== "PATCH") {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const oldHousehold = await Household.findById(householdId);
    if (!oldHousehold) {
      return response.status(404).json({ status: "Household not found." });
    }

    const memberRole = oldHousehold.members.find(
      (member) => member._id.toString() === sessionUserId
    )?.role;
    const actionIsAuthorized =
      sessionUserId === userId ||
      memberRole === "owner" ||
      memberRole === "canWrite";

    if (!actionIsAuthorized) {
      return response
        .status(403)
        .json({ error: "Not authorized to modify this household." });
    }
    if (
      oldHousehold.members.find((member) => member._id.toString() === userId)
    ) {
      await Household.findByIdAndUpdate(householdId, {
        $pull: { members: { _id: userId } },
      });

      // User finden und Haushaltsinformationen aktualisieren
      const member = await User.findById(userId);
      if (!member) {
        return response.status(404).json({ status: "Member not found." });
      }

      // Haushalt aus der Liste der Haushalte des Nutzers entfernen
      member.households = member.households.filter(
        (id) => id.toString() !== householdId
      );

      // Falls der zu entfernende Haushalt der aktive Haushalt ist, wählen wir einen neuen aktiven Haushalt, falls möglich
      if (
        member.activeHousehold &&
        member.activeHousehold.toString() === householdId
      ) {
        member.activeHousehold = member.households[0] || null; // Ersten verbleibenden Haushalt wählen oder null setzen, falls keine weiteren Haushalte vorhanden sind
      }

      console.log("saving member...");
      await member.save(); // Nutzerdaten speichern
      console.log("saved member, now return");
      return response.status(200).json({
        message: `User ${userId} was removed from household ${householdId}`,
      });
    }
  } catch (error) {
    console.error(error);
    return response.status(400).json({ error: error.message });
  }
}
