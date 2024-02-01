import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import axios from "axios";

const prisma = new PrismaClient();
export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post(
            process.env.NEXTAUTH_URL + "/api/login",
            {
              username: credentials.username,
              password: credentials.password,
            }
          );

          // console.log(response, "ooooooo");

          if (response.status === 200) {
            // Login successful, return the user data
            return response.data;
          } else {
            // Login failed, return null or throw an error
            console.log(response.data);

            throw Error(response.data.data);
          }
        } catch (error) {
          // Handle any errors that occur during the request
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 10,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // console.log("token = ", token);
      session.user = token;
      return session;
    },
  },
};
export default NextAuth(authOptions);
