import { Schema, model, Mongoose } from "mongoose";

const Form = new Schema(
  {
    questions: [
      {
        type: Schema.Types.ObjectId,
        required: [true, "Pergunta não identificada."],
        ref: "questions",
      },
    ],
    answers: [{ type: String, required: true }],
    client: {
      type: Schema.Types.ObjectId,
      required: [true, "Usuário não identificado."],
      ref: "clients",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const FormModel = model("forms", Form, "forms");
