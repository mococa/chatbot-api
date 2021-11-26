import { Schema, model } from "mongoose";

const Settings = new Schema(
  {
    questionsOrder: {
      type: Array,
    },
  },
  {
    versionKey: false,
  }
);

export const SettingsModel = model("settings", Settings, "settings");
