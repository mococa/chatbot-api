import { Router } from "express";
import { Client } from "../controllers/client";
import { WhatsappBot } from "../controllers/whatsapp";
import { phoneToJid } from "../helpers";
import { ClientModel } from "../models/client";

export const client_route = Router();
const route = client_route;

route.get("/:id/chat", async (req, res) => {
  const { id } = req.params;
  const client = await Client.get(id);
  const jid = phoneToJid(client.phone);
  const chat = await WhatsappBot.getClient().loadMessages(jid, 20);
  return res.json(chat);
});
route.post("/:id/chat", async (req, res) => {
  const { id } = req.params;
  const client = await Client.get(id);
  const jid = phoneToJid(client.phone);
  const message = req.body.message;
  await WhatsappBot.getClient().sendMessage(jid, message, "conversation");
  const chat = await WhatsappBot.getClient().loadMessages(jid, 20);
  return res.json(chat);
});
