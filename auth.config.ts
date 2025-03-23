import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	callbacks: {
		async signIn({ account }) {
			if (account?.provider === "google") {
				return true;
			}
			return false;
		},

		async jwt({ token, user, account }) {
			if (account && user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string;
			}

			return session;
		},
	},
	trustHost: true,
} satisfies NextAuthConfig;
