import { Router } from "express";
import { SettingsModel } from "../models/settings";

export const settings_route = Router();
const route = settings_route;

route.put("/welcome", async (req, res) => {
  if (req.body.welcome?.welcome?.some((field) => !field))
    return res
      .status(400)
      .json({ message: "Por favor, preencha todos os campos necessários" });
  await SettingsModel.findOneAndUpdate(
    {},
    { $set: { welcome: req.body.welcome?.welcome } }
  );
  const settings = await SettingsModel.findOne({}).lean();
  return res.json(settings);
});
route.put("/ask-questions", async (req, res) => {
  await SettingsModel.findOneAndUpdate(
    {},
    { $set: { askQuestions: req.body.askQuestions } }
  );
  const settings = await SettingsModel.findOne({}).lean();
  return res.json(settings);
});
