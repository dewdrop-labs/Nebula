import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(
            `${process.env.APP_URL}/api/database/registration`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                googleEmail: user.email,
                googleSub: account.providerAccountId,
                lastLogin: new Date().toISOString(),
              }),
            }
          );

          if (!response.ok) {
            console.error(
              "There was an error creating the user:",
              await response.text()
            );
            return false;
          }
        } catch (error) {
          console.error("Error in the signIn callback:", error);
          return false;
        }
      }
      return true;
    },
  },
};

export default authOptions;
