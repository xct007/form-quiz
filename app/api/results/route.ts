import { auth } from "@/auth";
import { ResultModel } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const results = await ResultModel.find({ userId: session.user.id }).sort({
			createdAt: -1,
		});

		return NextResponse.json(results);
	} catch (error) {
		console.error("Error fetching results:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
