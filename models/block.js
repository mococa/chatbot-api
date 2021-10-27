import { Schema, model, Mongoose } from "mongoose";

const Block = new Schema(
  {
    question: {
      type: String,
      required: [true, "Por favor, entre com uma pergunta."],
    },
    answer: { type: String, required: true },
    keywords: { type: [String], default: [] },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "Usuário não identificado."],
      ref: "users",
    },
  },
  {
    versionKey: false,
  }
);

export const BlockModel = model("blocks", Block, "blocks");
