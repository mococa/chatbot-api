import { Schema, model } from "mongoose";

const Question = new Schema(
  {
    title: {
        type: String,
        required: [true, "Sua pergunta precisa de um título"]
    },
    color: {
      type: String,
      enum: ["red, blue, green", "yellow"],
      default: "red",
    },
    keywords: { type: [String], default: [] },
    type: {
      type: String,
      enum: [],
    },
  },
  {
    versionKey: false,
  }
);

export const QuestionModel = model("questions", Question, "questions");
