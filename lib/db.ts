import { ConnectOptions, Mongoose, connect } from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options: ConnectOptions = {};

let clientPromise: Promise<Mongoose>;

if (process.env.NODE_ENV === "development") {
	const globalClient = global as typeof global & {
		_client?: Promise<Mongoose>;
	};

	if (!globalClient._client) {
		globalClient._client = connect(uri, options);
	}

	if (!globalClient._client) {
		throw new Error("Failed to initialize MongoDB client");
	}
	clientPromise = globalClient._client;
} else {
	clientPromise = connect(uri, options).then((client) => {
		console.log("Connected to MongoDB");
		return client;
	});
}

export default clientPromise;
