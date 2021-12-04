import { Router } from "express";
import { Client } from "../controllers/client";
import { WhatsappBot } from "../controllers/whatsapp";
import { phoneToJid } from "../helpers";
import { ClientModel } from "../models/client";
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
    { welcome: req.body.welcome?.welcome }
  );
  const settings = await SettingsModel.findOne({}).lean();
  return res.json(settings);
});
