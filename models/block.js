import { Schema, model, Mongoose } from "mongoose";

const Block = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    keywords: { type: [String], default: [] },
    user: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  },
  {
    versionKey: false,
  }
);

export const BlockModel = model("blocks", Block, "blocks");
