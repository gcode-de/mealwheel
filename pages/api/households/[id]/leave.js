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
  const { householdId } = request.query;
  const { userId } = request.body;

  console.log("session, household, user", sessionUserId, householdId, userId);

  if (request.method === "PATCH") {
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

      if (oldHousehold.members.find((member) => member._id === userId)) {
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
          (id) => !id.equals(householdId)
        );

        // Falls der zu entfernende Haushalt der aktive Haushalt ist, wählen wir einen neuen aktiven Haushalt, falls möglich
        if (
          member.activeHousehold &&
          member.activeHousehold.equals(householdId)
        ) {
          member.activeHousehold = member.households[0] || null; // Ersten verbleibenden Haushalt wählen oder null setzen, falls keine weiteren Haushalte vorhanden sind
        }

        await member.save(); // Nutzerdaten speichern

        return response
          .status(200)
          .json(`User ${userId} was removed from household ${householdId}`);
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
