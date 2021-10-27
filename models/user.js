import { Schema, model, Mongoose } from "mongoose";

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      minlength: [6, "Seu nome de usuário precisa conter no mínimo 6 digitos."],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Sua senha precisa conter no mínimo 8 dígitos."],
    },
  },
  {
    versionKey: false,
  }
);

export const UserModel = model("users", User, "users");
