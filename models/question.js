import { Schema, model } from "mongoose";

const Question = new Schema(
  {
    title: {
      type: String,
      required: [
        true,
        "Sua pergunta precisa de um título para identificá-la depois",
      ],
    },
    question: {
      type: String,
      required: [
        true,
        "Por favor, insira o que o BOT vai perguntar ao cliente",
      ],
    },
    color: {
      type: String,
      enum: ["#5e55ff", "#ff5555", "#ffc155", "#55ff6f"],
      required: [true, "Por favor, selecione uma cor"],
      default: "#5e55ff",
    },
    keywords: { type: [String], default: [] },
    type: {
      type: String,
      enum: ["phone", "unique", "e-mail", "number", "free"],
      required: [true, "Por favor, selecione um tipo para esta pergunta"],
    },
    options: {
      type: [String],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    versionKey: false,
  }
);

export const QuestionModel = model("questions", Question, "questions");
