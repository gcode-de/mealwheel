import connect from "@/db/connect";
import User from "@/db/models/User";
import Household from "@/db/models/Household";

import clientPromise from "@/db/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    signOut: "/",
  },

  callbacks: {
    // async signIn({ user, account, profile }) {
    //   const { email } = user;
    //   const existingUser = await User.findOne({ email });
    //   if (existingUser) {
    //     return true;
    //   } else {
    //     const newHousehold = await Household.create({
    //       name: `Haushalt von ${user.name}`,
    //       members: [{ _id: user._id, role: "owner" }],
    //       calendar: [],
    //       shoppingList: [],
    //       settings: {
    //         weekdaysEnabled: {
    //           0: true,
    //           1: true,
    //           2: true,
    //           3: true,
    //           4: true,
    //           5: true,
    //           6: true,
    //         },
    //         defaultDiet: [],
    //         mealsPerDay: 1,
    //         defaultNumberOfPeople: 1,
    //       },
    //     });
    //     const newUser = await User.create({
    //       email,
    //       userName: user.name,
    //       profilePictureLink: user.image,
    //       recipeInteractions: [],
    //       collections: [],
    //       households: [newHousehold._id],
    //       activeHousehold: [newHousehold._id],
    //     });
    //     if (newUser && newHousehold) {
    //       return true;
    //     } else {
    //       console.error("Benutzer oder Haushalt konnte nicht erstellt werden.");
    //       return false;
    //     }
    //   }
    // },
    async signIn({ user, account, profile }) {
      const { email } = user;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return true;
      } else {
        // Zuerst den User erstellen
        const newUser = await User.create({
          email,
          userName: user.name,
          profilePictureLink: user.image,
          recipeInteractions: [],
          collections: [],
          // households und activeHousehold werden später aktualisiert
        });

        // Dann den Household erstellen, nachdem der User bereits eine ID hat
        const newHousehold = await Household.create({
          name: `Haushalt von ${user.name}`,
          members: [{ _id: newUser._id, role: "owner" }], // Verwende newUser._id
          calendar: [],
          shoppingList: [],
          settings: {
            weekdaysEnabled: {
              0: true,
              1: true,
              2: true,
              3: true,
              4: true,
              5: true,
              6: true,
            },
            defaultDiet: [],
            mealsPerDay: 1,
            defaultNumberOfPeople: 1,
          },
        });

        // Aktualisiere den neu erstellten User mit den Household-Informationen
        newUser.households = [newHousehold._id];
        newUser.activeHousehold = newHousehold._id;
        await newUser.save();

        if (newUser && newHousehold) {
          return true;
        } else {
          console.error("Benutzer oder Haushalt konnte nicht erstellt werden.");
          return false;
        }
      }
    },
    async session({ session, user }) {
      await connect();

      const currentUser = await User.findById(user.id);

      if (currentUser.calendar == null) {
        currentUser.calendar = [];
        await currentUser.save();
      }
      if (currentUser.recipeInteractions == null) {
        currentUser.recipeInteractions = [];
        await currentUser.save();
      }
      if (currentUser.collections == null) {
        currentUser.collections = [];
        await currentUser.save();
      }
      if (currentUser.shoppingList == null) {
        currentUser.shoppingList = [];
        await currentUser.save();
      }

      return { ...session, user: { ...session.user, id: user.id } };
    },
  },
};

export default NextAuth(authOptions);
