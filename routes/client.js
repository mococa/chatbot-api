import { Router } from "express";
import { Client } from "../controllers/client";
import { WhatsappBot } from "../controllers/whatsapp";
import { phoneToJid } from "../helpers";
import { ClientModel } from "../models/client";

export const client_route = Router();
const route = client_route;

route.get("/", async (req, res) => {
  const clients = await Client.get();
  return res.json(clients);
});

route.get("/:id", async (req, res) => {
  const { id } = req.params;
  const clients = await Client.get(id);
  return res.json(clients);
});
route.get("/:id/chat", async (req, res) => {
  const { id } = req.params;
  const bot = WhatsappBot.getClient();
  if (WhatsappBot.getReady() && WhatsappBot.getLoggedIn()) {
    const client = await Client.get(id);
    const jid = phoneToJid(client.phone);
    const chat = await bot.loadMessages(jid, 20);
    return res.json(chat);
  }
  return res.status(404).json({ message: "O Bot está atualmente desligado" });
});
route.post("/:id/chat", async (req, res) => {
  const { id } = req.params;
  const bot = WhatsappBot.getClient();
  if (WhatsappBot.getReady() && WhatsappBot.getLoggedIn()) {
    const client = await Client.get(id);
    const jid = phoneToJid(client.phone);
    const message = req.body.message;
    await bot.sendMessage(jid, message, "conversation");
    const chat = await bot.loadMessages(jid, 20);
    return res.json(chat);
  }
  return res.status(404).json({ message: "O Bot está atualmente desligado" });
});
