import FormClient from "@/components/quiz/form";
import clientPromise from "@/lib/db";
import { FormModel } from "@/lib/models";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

interface FormPageProps {
	params: Promise<{ formId: string }>;
}

const getForm = cache(async (formId: string) => {
	await clientPromise;
	const form = await FormModel.findOne({ formId });
	if (!form) {
		return null;
	}
	return form;
});

export async function generateMetadata({
	params,
}: FormPageProps): Promise<Metadata> {
	const { formId } = await params;
	const form = await getForm(formId);

	if (!form) {
		return {
			title: "Form not found",
			description: "The form you are looking for does not exist.",
		};
	}

	return {
		title: form.title,
		description: form.description,
	};
}

export default async function FormPage({ params }: FormPageProps) {
	const { formId } = await params;
	const form = await getForm(formId);

	if (!form) {
		notFound();
	}

	const questions = form.questions.map(
		({ questionId, questionText, options }) => ({
			questionId,
			questionText,
			options,
		})
	);

	return (
		<div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
			<FormClient
				formId={formId}
				title={form.title}
				description={form.description}
				questions={questions}
			/>
		</div>
	);
}
