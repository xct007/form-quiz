import clientPromise from "@/lib/db";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { MongooseAdapter } from "./lib/mongoose";

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: MongooseAdapter(await clientPromise),
	session: {
		strategy: "jwt",
	},
	...authConfig,
});
