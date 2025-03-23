/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
	Adapter,
	AdapterAccount,
	AdapterSession,
	AdapterUser,
	VerificationToken,
} from "@auth/core/adapters";
import { ObjectId } from "mongodb";
import { Mongoose } from "mongoose";

// @ts-expect-error read only property is not assignable
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");

export interface MongooseAdapterOptions {
	collections?: {
		Users?: string;
		Accounts?: string;
		Sessions?: string;
		VerificationTokens?: string;
	};
	databaseName?: string;
	onClose?: (client: Mongoose) => Promise<void>;
}

export const defaultCollections: Required<
	Required<MongooseAdapterOptions>["collections"]
> = {
	Users: "users",
	Accounts: "accounts",
	Sessions: "sessions",
	VerificationTokens: "verification_tokens",
};

export const format = {
	from<T = Record<string, unknown>>(object: Record<string, any>): T {
		const newObject: Record<string, unknown> = {};
		for (const key in object) {
			const value = object[key];
			if (key === "_id") {
				newObject.id = value.toHexString();
			} else if (key === "userId") {
				newObject[key] = value.toHexString();
			} else {
				newObject[key] = value;
			}
		}
		return newObject as T;
	},
	to<T = Record<string, unknown>>(object: Record<string, any>) {
		const newObject: Record<string, unknown> = {
			_id: _id(object.id),
		};
		for (const key in object) {
			const value = object[key];
			if (key === "userId") {
				newObject[key] = _id(value);
			} else if (key !== "id") {
				newObject[key] = value;
			}
		}
		return newObject as T & { _id: ObjectId };
	},
};

export function _id(hex?: string) {
	return hex?.length === 24 ? new ObjectId(hex) : new ObjectId();
}

export function MongooseAdapter(
	client: Mongoose | Promise<Mongoose> | (() => Mongoose | Promise<Mongoose>),
	options: MongooseAdapterOptions = {}
): Adapter {
	const { collections } = options;
	const { from, to } = format;

	const getDb = async () => {
		const _client: Mongoose = await (typeof client === "function"
			? client()
			: client);
		const _mongoClient = _client.connection.getClient();
		const _db = _mongoClient.db(options.databaseName);
		const c = { ...defaultCollections, ...collections };
		return {
			U: _db.collection<AdapterUser>(c.Users),
			A: _db.collection<AdapterAccount>(c.Accounts),
			S: _db.collection<AdapterSession>(c.Sessions),
			V: _db.collection<VerificationToken>(c.VerificationTokens),
			[Symbol.asyncDispose]: async () => {
				await options.onClose?.(_client);
			},
		};
	};

	const createUser = async (data: AdapterUser) => {
		const user = to<AdapterUser>(data);
		await using db = await getDb();
		await db.U.insertOne(user);
		return from<AdapterUser>(user);
	};

	const getUser = async (id: string) => {
		await using db = await getDb();
		const user = await db.U.findOne({ _id: _id(id) });
		if (!user) return null;
		return from<AdapterUser>(user);
	};

	const getUserByEmail = async (email: string) => {
		await using db = await getDb();
		const user = await db.U.findOne({ email });
		if (!user) return null;
		return from<AdapterUser>(user);
	};

	const getUserByAccount = async (provider_providerAccountId: any) => {
		await using db = await getDb();
		const account = await db.A.findOne(provider_providerAccountId);
		if (!account) return null;
		const user = await db.U.findOne({ _id: new ObjectId(account.userId) });
		if (!user) return null;
		return from<AdapterUser>(user);
	};

	const updateUser = async (data: AdapterUser) => {
		const { _id, ...user } = to<AdapterUser>(data);
		await using db = await getDb();
		const result = await db.U.findOneAndUpdate(
			{ _id },
			{ $set: user },
			{ returnDocument: "after" }
		);
		return from<AdapterUser>(result!);
	};

	const deleteUser = async (id: string) => {
		const userId = _id(id);
		await using db = await getDb();
		await Promise.all([
			db.A.deleteMany({ userId: userId as any }),
			db.S.deleteMany({ userId: userId as any }),
			db.U.deleteOne({ _id: userId }),
		]);
	};

	const linkAccount = async (data: AdapterAccount) => {
		const account = to<AdapterAccount>(data);
		await using db = await getDb();
		await db.A.insertOne(account);
		return account;
	};

	const unlinkAccount = async (provider_providerAccountId: any) => {
		await using db = await getDb();
		const account = await db.A.findOneAndDelete(provider_providerAccountId);
		return from<AdapterAccount>(account!);
	};

	const getSessionAndUser = async (sessionToken: string) => {
		await using db = await getDb();
		const session = await db.S.findOne({ sessionToken });
		if (!session) return null;
		const user = await db.U.findOne({ _id: new ObjectId(session.userId) });
		if (!user) return null;
		return {
			user: from<AdapterUser>(user),
			session: from<AdapterSession>(session),
		};
	};

	const createSession = async (data: AdapterSession) => {
		const session = to<AdapterSession>(data);
		await using db = await getDb();
		await db.S.insertOne(session);
		return from<AdapterSession>(session);
	};

	const updateSession = async (data: AdapterSession) => {
		const { _id, ...session } = to<AdapterSession>(data);
		await using db = await getDb();
		const updatedSession = await db.S.findOneAndUpdate(
			{ sessionToken: session.sessionToken },
			{ $set: session },
			{ returnDocument: "after" }
		);
		return from<AdapterSession>(updatedSession!);
	};

	const deleteSession = async (sessionToken: string) => {
		await using db = await getDb();
		const session = await db.S.findOneAndDelete({ sessionToken });
		return from<AdapterSession>(session!);
	};

	const createVerificationToken = async (data: VerificationToken) => {
		await using db = await getDb();
		await db.V.insertOne(to(data));
		return data;
	};

	const useVerificationToken = async (identifier_token: any) => {
		await using db = await getDb();
		const verificationToken = await db.V.findOneAndDelete(identifier_token);
		if (!verificationToken) return null;
		const { _id, ...rest } = verificationToken;
		return rest;
	};

	return {
		createUser,
		getUser,
		getUserByEmail,
		getUserByAccount,
		updateUser,
		deleteUser,
		linkAccount,
		unlinkAccount,
		getSessionAndUser,
		createSession,
		updateSession,
		deleteSession,
		createVerificationToken,
		useVerificationToken,
	};
}
