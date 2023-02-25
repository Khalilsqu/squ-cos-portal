import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      httpOptions: {
        timeout: 40000,
      },
    }),

    // ...add more providers here
  ],

  session: {
    maxAge: 60 * 60, // 1 hour session expiry when idle
  },
  secret: process.env.JWT_SECRET,

  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        return profile.email_verified && profile.email.endsWith("squ.edu.om");
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    async redirect({url, baseUrl}) {
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl);
    },
  },
  pages: {
    signIn: "/auth/signin",
  },

  site: process.env.NEXTAUTH_URL,
};

export default NextAuth(authOptions);
