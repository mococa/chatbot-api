import { Schema, model } from "mongoose";

const Settings = new Schema(
  {
    questionsOrder: {
      type: Array,
    },
    welcome: {
      type: Array,
      validate: [(v) => v === 2, "Deve-se haver 2 perguntas de boas vindas, nesta ordem: Nome e Email"],
    },
  },
  {
    versionKey: false,
  }
);

export const SettingsModel = model("settings", Settings, "settings");
