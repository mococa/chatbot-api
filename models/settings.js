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
