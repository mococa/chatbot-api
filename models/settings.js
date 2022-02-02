import { Schema, model } from "mongoose";

const Settings = new Schema(
  {
    questionsOrder: {
      type: [String],
    },
    welcome: {
      type: [String],
      validate: [
        (v) => v.length === 2 && v.every((field) => typeof field === "string"),
        "Deve-se haver 2 perguntas de boas vindas, nesta ordem: Nome e Email",
      ],
    },
    signupConfirmation: {
      type: String,
      default: "Seus dados estão certo?",
    },
    formConfirmation: {
      type: String,
      default: "Confirma?",
    },
    alreadySigned: {
      type: String,
      default: "Você já assinou um formulário recentemente",
    },
    cooldown: {
      type: String,
      default: "1",
    },
    goodbye: String,
    feedback: String,
    askQuestions: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

export const SettingsModel = model("settings", Settings, "settings");
