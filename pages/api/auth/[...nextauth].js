import connect from "@/db/connect";
import User from "@/db/models/User";
import clientPromise from "@/db/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth/next";

import GithubProvider from "next-auth/providers/github";

export default NextAuth({
  // Configure one or more authetication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
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
});
