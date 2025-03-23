import { FormModel } from "@/lib/models";
import Link from "next/link";

export default async function Home() {
	const forms = await FormModel.find().sort({ createdAt: -1 });

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<h1 className="text-3xl font-bold text-center">Welcome</h1>

			<p className="text-center text-gray-500 max-w-lg">
				Simple forms and quizzes to help you learn and grow. Get started by
				selecting a form below.
			</p>

			<div className="w-full max-w-lg mt-8">
				<div className="shadow-md rounded-lg p-4">
					<h2 className="text-2xl font-semibold mb-2">Available Forms</h2>
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
			</div>
		</section>
	);
}
