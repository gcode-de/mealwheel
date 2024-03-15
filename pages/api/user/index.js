import dbConnect from "../../../db/connect";
import User from "../../../db/models/User";
import Recipe from "../../../db/models/Recipe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  const data = getKindeServerSession(request, response);
  const kindeUser = await data.getUser();
  const isAuthenticated = await data.isAuthenticated();

  if (!isAuthenticated) {
    return response.status(401).json({ status: "unathorized" });
  }

  if (request.method === "GET") {
    let user = await User.findOne({
      loginId: kindeUser?.id,
      //  || "kp_0047cc6bee3348c6a80f0c2901f23943",
    })
      .populate("recipeInteractions.recipe")
      .populate("calendar.recipe");

    if (!user) {
      user = await User.create({
        loginId: kindeUser.id,
        firstName: kindeUser.given_name,
        lastName: kindeUser.family_name,
        email: kindeUser.email,
        calendar: [],
        recipeInteractions: [],
        settings: {},
      });
    }

    // Überprüfen, ob alle verknüpften Rezepte existieren
    user.recipeInteractions = user.recipeInteractions.filter(
      (interaction) => interaction.recipe
    );
    user.calendar = user.calendar.filter((event) => event.recipe);

    response.status(200).json(user);
  }

  if (request.method === "PUT") {
    try {
      if (!kindeUser || !kindeUser.id) {
        return response.status(404).json({ error: "Kinde User not found" });
      }

      const updatedUser = await User.findOneAndUpdate(
        { loginId: kindeUser.id },
        request.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedUser) {
        return response.status(404).json({ error: "User not found" });
      }

      return response.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: error.message });
    }
  }
}
