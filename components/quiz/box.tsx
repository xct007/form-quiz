"use client";

import {
	Card,
	CardBody,
	CardHeader,
	Divider,
	Radio,
	RadioGroup,
} from "@heroui/react";
import React from "react";

interface QuizBoxProps {
	title: string;
	description: string;

	endContent?: React.ReactNode;
}
export const QuizBox: React.FC<QuizBoxProps> = ({
	title,
	description,
	endContent,
}) => {
	return (
		<Card className="w-full shadow-md rounded-lg p-4">
			<CardHeader className="flex justify-between">
				<div className="flex flex-col">
					<p className="text-md">{title}</p>
					<p className="text-small text-default-500">{description}</p>
				</div>
				{endContent}
			</CardHeader>
		</Card>
	);
};

interface QuizQuestionProps {
	questionId: string;
	questionText: string;
	options: string[];
	selectedAnswer: string;
	onAnswerSelect: (option: string) => void;
	isRequired?: boolean;
}
export const QuizQuestion: React.FC<QuizQuestionProps> = ({
	questionText,
	options,
	selectedAnswer,
	isRequired,
	onAnswerSelect,
}) => {
	return (
		<Card className="w-full shadow-md rounded-lg p-4">
			<CardHeader>
				<p className="text-md font-bold">{questionText}</p>
			</CardHeader>
			<Divider />
			<CardBody className="flex flex-col gap-3">
				<RadioGroup
					defaultValue={selectedAnswer}
					isRequired={isRequired}
					onValueChange={(value) => {
						console.log(value);
						onAnswerSelect(value);
					}}
				>
					{options.map((option, index) => (
						<Radio
							key={option}
							value={option}
							aria-label={`Option ${index + 1}: ${option}`}
						>
							{option}
						</Radio>
					))}
				</RadioGroup>
			</CardBody>
		</Card>
	);
};
