import dbConnect from "../../../db/connect";
import User from "../../../db/models/User";
import Recipe from "../../../db/models/Recipe";
import Household from "@/db/models/Household";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  await dbConnect();

  const session = await getServerSession(request, response, authOptions);

  if (!session) return response.status(403).json({ error: "unauthenticated" });

  if (request.method === "GET") {
    const user = await User.findById(session.user.id)
      .populate("recipeInteractions.recipe")
      .populate("collections.recipes")
      .populate("households");
    // .populate("activeHousehold");//wohl hier nicht benötigt, da die IDs ausreichen, un der Haushalt sowieso separat gefetched werden muss um damit persistens zu arbeiten.

    if (!user) {
      return response.status(404).json({ status: "Not Found" });
    }

    // Überprüfen, ob alle verknüpften Rezepte existieren
    user.recipeInteractions = user.recipeInteractions.filter(
      (interaction) => interaction.recipe
    );
    // user.calendar = user.calendar.filter((event) => event.recipe);  //entfernt weil sonst Kalendertage ohne Rezept nicht im Wochenplan deaktiviert werden können.

    // Aktualisiere das letzte Login-Datum des Nutzers
    user.lastLogin = new Date();
    await user.save();

    response.status(200).json(user);
  }

  if (request.method === "PUT") {
    try {
      await User.findByIdAndUpdate(session.user.id, request.body);
      return response.status(200).json("User updated");
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: error.message });
    }
  }
}
