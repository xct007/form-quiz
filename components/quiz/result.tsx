"use client";

import { formatElapsedTime } from "@/utils/format-time";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	getKeyValue,
} from "@heroui/react";
import React from "react";

interface TableResultProps {
	results: {
		id: string;
		formId: string;
		score: number;
		totalQuestions: number;
		timeTaken: number;
		createdAt: NativeDate;
	}[];
}

export const TableResult: React.FC<TableResultProps> = ({ results }) => {
	return (
		<Table aria-label="Example static collection table">
			<TableHeader>
				<TableColumn>FORM ID</TableColumn>
				<TableColumn>SCORE</TableColumn>
				<TableColumn>TIME TAKEN</TableColumn>
				<TableColumn>DATE</TableColumn>
			</TableHeader>
			<TableBody items={results}>
				{(result) => (
					<TableRow key={getKeyValue(result, "id")}>
						<TableCell>{getKeyValue(result, "formId")}</TableCell>
						<TableCell>
							{getKeyValue(result, "score")} /{" "}
							{getKeyValue(result, "totalQuestions")}
						</TableCell>
						<TableCell>
							{formatElapsedTime(getKeyValue(result, "timeTaken"))}
						</TableCell>
						<TableCell suppressHydrationWarning>
							{new Date(getKeyValue(result, "createdAt")).toLocaleString()}
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
