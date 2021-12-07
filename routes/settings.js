import { Router } from "express";
import { SettingsModel } from "../models/settings";

export const settings_route = Router();
const route = settings_route;

route.put("/save", async (req, res) => {
  const { welcome, goodbye, feedback } = req.body;
  if (welcome?.some((field) => !field) || !goodbye || !feedback)
    return res
      .status(400)
      .json({ message: "Por favor, preencha todos os campos necessários" });
  await SettingsModel.updateOne(
    {},
    { $set: { welcome, goodbye, feedback } },
    { upsert: true }
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
