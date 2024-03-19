import connect from "@/db/connect";
import User from "@/db/models/User";

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
    signOut: "/",
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return true;
      } else {
        const newUser = await User.create({
          email,
          userName: user.name,
          profilePictureLink: user.image,
          recipeInteractions: [],
          calendar: [],
          collections: [],
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
        if (newUser) {
          return true;
        } else {
          console.error("Benutzer konnte nicht erstellt werden.");
          return false;
        }
      }
    },
    async session({ session, user }) {
      connect();

      const currentUser = await User.findById(user.id);

      if (currentUser.calendar == null) {
        currentUser.calendar = [];
        currentUser.save();
      }
      if (currentUser.recipeInteractions == null) {
        currentUser.recipeInteractions = [];
        currentUser.save();
      }
      if (currentUser.collections == null) {
        currentUser.collections = [];
        currentUser.save();
      }
      if (currentUser.shoppingList == null) {
        currentUser.shoppingList = [];
        currentUser.save();
      }

      return { ...session, user: { ...session.user, id: user.id } };
    },
  },
};

export default NextAuth(authOptions);
