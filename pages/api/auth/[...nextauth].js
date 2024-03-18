import connect from "@/db/connect";
import User from "@/db/models/User";
import clientPromise from "@/db/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth/next";

import AppleProvider from "next-auth/providers/apple";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),

  callbacks: {
    async session({ session, user }) {
      connect();

      const currentUser = await User.findById(user.id);

      if (currentUser.calendar == null) {
        currentUser.calendar = [];
        currentUser.save();
      }

      return { ...session, user: { ...session.user, id: user.id } };
    },
  },
};

export default NextAuth(authOptions);
