import mongoose, { InferSchemaType, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const QuestionSchema = new mongoose.Schema({
	questionId: { type: String, default: uuidv4, unique: true },
	questionText: { type: String, required: true },
	options: { type: [String], required: true },
	correctOption: { type: String, required: true },
});
const formSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		default: "",
	},
	formId: {
		type: String,
		required: true,
		unique: true,
	},
	questions: [QuestionSchema],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const ResultSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	formId: { type: String, required: true },
	answers: [
		{
			questionId: { type: String, required: true },
			selectedOption: { type: String, required: true },
		},
	],
	timeTaken: { type: Number, required: true },
	score: { type: Number, required: true },
	totalQuestions: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
});

export type Result = InferSchemaType<typeof ResultSchema>;
export type Form = InferSchemaType<typeof formSchema>;

export const ResultModel =
	(mongoose.models.Result as Model<Result>) ||
	mongoose.model("Result", ResultSchema);
export const FormModel =
	(mongoose.models.Form as Model<Form>) || mongoose.model("Form", formSchema);
