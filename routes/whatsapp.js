import { Router } from "express";
import { WhatsappBot } from "../controllers/whatsapp";

export const whatsapp_route = Router();
const route = whatsapp_route;

route.get("/", async (req, res) => {
  const qr = WhatsappBot.getQR();
  const ready = WhatsappBot.getReady();
  //res.json({ qr, ready });
  res.send(`
    <img src="${qr}"/>
  `);
});
