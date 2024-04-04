import dbConnect from "../../../../db/connect";
import User from "../../../../db/models/User";
import Household from "../../../../db/models/Household";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);
  if (!session) {
    return response.status(403).json({ error: "unauthenticated" });
  }
  await dbConnect();

  const adminIdId = session.user.id;
  const { id: memberId } = request.query;
  const { householdId } = request.body;

  if (request.method === "PATCH") {
    try {
      const household = await Household.findById(householdId);
      const admin = household.members.find((member) =>
        member.id.equals(adminIdId)
      );

      if (!admin || (admin.role !== "owner" && admin.role !== "canWrite")) {
        return response
          .status(403)
          .json({ error: "Not authorized to modify this household." });
      }

      // User finden und Haushaltsinformationen aktualisieren
      const member = await User.findById(memberId);

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

      return response.status(200).json({
        status: `Household ${householdId} removed from user ${member}.`,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }
}
