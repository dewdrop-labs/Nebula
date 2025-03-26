import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user in database
          const result = await sql`
            SELECT * FROM users WHERE google_email = ${credentials.email}
          `;

          if (result.rows.length === 0) {
            return null;
          }

          const user = result.rows[0];

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            return null;
          }

          // Update last login
          await sql`
            UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}
          `;

          // Return only the basic user information
          return {
            id: user.id.toString(),
            email: user.google_email,
            name: user.name || user.google_email
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
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
    }
  },
  pages: {
    signIn: '/login'
  }
};

export default authOptions;