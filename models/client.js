import { Schema, model } from "mongoose";

const Client = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nome do cliente é um campo obrigatório"],
    },
    picture: {
      type: String,
    },
    age: { type: String },
    phone: {
      type: String,
      required: [true, "Número de telefone é um campo obrigatório"],
    },
    email: {
      type: String,
      required: [true, "E-mail é um campo obrigatório"],
      lowercase: true,
    },
    channels: {
      type: [String],
      enum: ["whatsapp", "instagram", "facebook"],
      required: [true, "Por favor, especifique um canal"],
    },
  },
  {
    versionKey: false,
  }
);

export const ClientModel = model("clients", Client, "clients");
