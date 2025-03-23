import { auth } from "@/auth";
import { TableResult } from "@/components/quiz/result";
import { FormModel, ResultModel } from "@/lib/models";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await auth();
	if (!session) {
		redirect("/");
	}

	const results = await ResultModel.find({ userId: session.user.id }).sort({
		createdAt: -1,
	});

	const forms = await FormModel.find().sort({ createdAt: -1 });

	const safeResults = results.map((result) => ({
		id: result._id.toString(),
		formId: result.formId,
		score: result.score,
		totalQuestions: result.totalQuestions,
		timeTaken: result.timeTaken,
		createdAt: result.createdAt,
	}));

	return (
		<div className="w-full max-w-4xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Your Results</h1>

			{results.length === 0 ? (
				<p>No results found.</p>
			) : (
				// <table className="w-full border-collapse border border-gray-300">
				// 	<thead>
				// 		<tr className="bg-gray-200">
				// 			<th className="border border-gray-300 px-4 py-2">Form ID</th>
				// 			<th className="border border-gray-300 px-4 py-2">Score</th>
				// 			<th className="border border-gray-300 px-4 py-2">
				// 				Time Taken (s)
				// 			</th>
				// 			<th className="border border-gray-300 px-4 py-2">Date</th>
				// 		</tr>
				// 	</thead>
				// 	<tbody>
				// 		{results.map((result) => (
				// 			<tr key={result._id.toString()}>
				// 				<td className="border border-gray-300 px-4 py-2">
				// 					{result.formId}
				// 				</td>
				// 				<td className="border border-gray-300 px-4 py-2">
				// 					{result.score} / {result.totalQuestions}
				// 				</td>
				// 				<td className="border border-gray-300 px-4 py-2">
				// 					{formatElapsedTime(result.timeTaken)}
				// 				</td>
				// 				<td className="border border-gray-300 px-4 py-2">
				// 					{new Date(result.createdAt).toLocaleString()}
				// 				</td>
				// 			</tr>
				// 		))}
				// 	</tbody>
				// </table>
				<TableResult results={safeResults} />
			)}

			<h2 className="text-2xl font-bold mt-8 mb-4">Available Forms</h2>
			{forms.length === 0 ? (
				<p>No forms available.</p>
			) : (
				<ul>
					{forms.map((form) => (
						<li key={form.formId}>
							<Link href={`/form/${form.formId}`} className="text-blue-500">
								{form.title}
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
