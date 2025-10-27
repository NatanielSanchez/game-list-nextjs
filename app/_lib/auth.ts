import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createUser, getUserByEmail } from "./apiUser";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        const u = await getUserByEmail(user.email);
        if (!u) {
          const name = user.name || user.email.split("@")[0];
          await createUser({ name, email: user.email });
        }
        return true;
      } catch {
        return false;
      }
    },
    async session({ session }) {
      const user = await getUserByEmail(session.user.email);
      session.user.userId = user?.id;
      return session;
    },
  },
});
