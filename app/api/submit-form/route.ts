import { auth } from "@/auth";
import { FormModel } from "@/lib/models";
import { ResultModel } from "@/lib/models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { formId, answers, timeTaken } = await req.json();

		if (!formId || !Array.isArray(answers) || typeof timeTaken !== "number") {
			return NextResponse.json(
				{ error: "Invalid request data" },
				{ status: 400 }
			);
		}

		const form = await FormModel.findOne({ formId });
		if (!form) {
			return NextResponse.json({ error: "Form not found" }, { status: 404 });
		}

		const totalQuestions = form.questions.length;
		const correctAnswers = answers.reduce(
			(count, { questionId, selectedOption }) => {
				const question = form.questions.find(
					(q) => q.questionId === questionId
				);
				return question && question.correctOption === selectedOption
					? count + 1
					: count;
			},
			0
		);

		const score = correctAnswers / totalQuestions;

		const result = await ResultModel.findOneAndUpdate(
			{
				userId: session.user.id,
			},
			{
				formId,
				answers,
				timeTaken,
				score,
				totalQuestions,
			},
			{ upsert: true, new: true }
		);

		return NextResponse.json({ message: "Submission successful", result });
	} catch (error) {
		console.error("Submission error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
