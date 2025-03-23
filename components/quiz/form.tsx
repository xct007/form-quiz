"use client";

import { QuizBox, QuizQuestion } from "@/components/quiz/box";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { formatElapsedTime } from "@/utils/format-time";
import { Progress } from "@heroui/progress";
import { Button, Card, Chip } from "@heroui/react";
import { TimerIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import useLocalStorage from "use-local-storage";

interface Question {
	questionId: string;
	questionText: string;
	options: string[];
}

interface FormClientProps {
	formId: string;
	title: string;
	description: string;
	questions: Question[];
}

export default function FormClient({
	formId,
	title,
	description,
	questions,
}: FormClientProps) {
	const session = useSession();
	const { openModal } = useAuthModal();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [result, setResult] = useState<any>(null);
	const [questionState, setQuestionState] = useLocalStorage(
		formId,
		{
			startTime: 0,
			quizStarted: false,
			currentIndex: 0,
			answers: {} as Record<string, string>,
		},
		{ syncData: true }
	);

	const [elapsedTime, setElapsedTime] = useState(0);

	useEffect(() => {
		if (questionState.quizStarted) {
			setQuestionState({
				...questionState,
				quizStarted: false,
			});
		}

		if (questionState.startTime) {
			setQuestionState({
				...questionState,
				startTime: 0,
			});
		}

		setQuestionState({
			...questionState,
			currentIndex: 0,
		});

		setQuestionState({
			...questionState,
			answers: {},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formId]);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (questionState.quizStarted) {
			timer = setInterval(() => {
				setElapsedTime(
					Math.floor((Date.now() - questionState.startTime) / 1000)
				);
			}, 1000);
		} else {
			setElapsedTime(0);
		}
		return () => clearInterval(timer);
	}, [questionState.quizStarted, questionState.startTime]);

	const startQuiz = useCallback(() => {
		setResult(null);
		const now = Date.now();
		setQuestionState({
			...questionState,
			startTime: now,
			quizStarted: true,
		});
	}, [questionState, setQuestionState]);

	const handleAnswer = (questionId: string, option: string) => {
		const newAnswers = {
			...questionState.answers,
			[questionId]: option,
		};
		setQuestionState({
			...questionState,
			answers: newAnswers,
		});
	};

	const handlePrevious = () => {
		if (questionState.currentIndex > 0) {
			const newIndex = questionState.currentIndex - 1;
			setQuestionState({
				...questionState,
				currentIndex: newIndex,
			});
		}
	};

	const question = questions[questionState.currentIndex];

	const endContent = useMemo(() => {
		if (questionState.quizStarted) {
			return (
				<Chip
					startContent={<TimerIcon size={16} />}
					aria-label="Elapsed Time"
					aria-labelledby="Elapsed Time"
				>
					{formatElapsedTime(elapsedTime)}
				</Chip>
			);
		}
		if (session.status === "authenticated") {
			return (
				<Button
					onPress={startQuiz}
					aria-label="Start Quiz"
					aria-labelledby="Start Quiz"
				>
					Start
				</Button>
			);
		} else {
			return (
				<Button onPress={openModal} aria-label="Login to Start Quiz">
					Login to Start
				</Button>
			);
		}
	}, [
		questionState.quizStarted,
		session.status,
		elapsedTime,
		startQuiz,
		openModal,
	]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (questionState.currentIndex < questions.length - 1) {
			const newIndex = questionState.currentIndex + 1;
			setQuestionState({
				...questionState,
				currentIndex: newIndex,
			});
		} else {
			if (!questionState.startTime) return;

			const endTime = Date.now();
			const totalTime = Math.floor((endTime - questionState.startTime) / 1000);
			const res = await fetch("/api/submit-form", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					formId,
					timeTaken: totalTime,
					answers: Object.entries(questionState.answers).map(
						([questionId, selectedOption]) => ({
							questionId,
							selectedOption,
						})
					),
				}),
			});

			const data = await res.json();
			setResult(data.result);

			// reset
			setQuestionState({
				...questionState,
				startTime: 0,
				quizStarted: false,
				currentIndex: 0,
				answers: {},
			});
		}
	};

	return (
		<div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
			<QuizBox
				title={title}
				description={description}
				endContent={endContent}
			/>

			{questionState.quizStarted && (
				<form suppressHydrationWarning onSubmit={handleSubmit}>
					<QuizQuestion
						questionId={question.questionId}
						questionText={question.questionText}
						options={question.options}
						selectedAnswer={questionState.answers[question.questionId]}
						onAnswerSelect={(option) =>
							handleAnswer(question.questionId, option)
						}
						isRequired
					/>

					<Progress
						value={((questionState.currentIndex + 1) / questions.length) * 100}
						className="my-4"
						arial-label="Progress"
						aria-labelledby="Progress"
					/>

					<div className="flex justify-between mt-4">
						<Button
							onPress={handlePrevious}
							isDisabled={questionState.currentIndex === 0}
							aria-label="Previous Question"
						>
							Previous
						</Button>
						<Button
							type="submit"
							color={
								questionState.currentIndex < questions.length - 1
									? "primary"
									: "success"
							}
						>
							{questionState.currentIndex < questions.length - 1
								? "Next"
								: "Submit"}
						</Button>
					</div>
				</form>
			)}

			{result && (
				<Card className="p-4">
					<h2 className="text-xl font-bold text-center">Completed</h2>

					<p className="text-center">
						Total Time Taken: {formatElapsedTime(result.timeTaken)}
					</p>
					<p className="text-center">Score: {result.score}</p>

					<div className="mt-4">
						{result.answers.map(
							(answer: { questionId: string; selectedOption: string }) => {
								const question = questions.find(
									(q) => q.questionId === answer.questionId
								);
								if (!question) {
									return null;
								}
								return (
									<div key={question.questionId} className="mb-4">
										<h3 className="text-lg font-semibold">
											{question.questionText}
										</h3>
										<p>Your Answer: {answer.selectedOption}</p>
									</div>
								);
							}
						)}
					</div>
				</Card>
			)}
		</div>
	);
}
