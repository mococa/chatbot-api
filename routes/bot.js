import { Router } from "express";
import { WhatsappBot } from "../controllers/whatsapp";

export const bot_route = Router();
const route = bot_route;

route.get("/whatsapp", (req, res) => {
  const ready = !!WhatsappBot.getReady();
  const qr = ready ? null : WhatsappBot.getQR();
  const client = ready ? WhatsappBot.getInfo() : null;
  res.json({ ready, qr, ...(client ? { client } : {}) });
});
route.get("/whatsapp/turn-off", async (req, res) => {
  if (!WhatsappBot.getReady()) return res.json({ ok: true });
  WhatsappBot.removeSession().then(async () => {
    await WhatsappBot.getClient().logout();
    res.json({ ok: true });
  });
});
