import { Router } from "express";
import { Instagram } from "../controllers/instagram";
import { WhatsappBot } from "../controllers/whatsapp";

export const bot_route = Router();
const route = bot_route;

route.get("/whatsapp", (req, res) => {
  const ready = !!WhatsappBot.getReady();
  const qr = ready ? null : WhatsappBot.getQR();
  const client = ready ? WhatsappBot.getInfo() : null;
  res.json({ ready, qr, ...(client ? { client } : {}) });
});
route.get("/instagram", async (req, res) => {
  const session = await Instagram.getSession().catch(() => null);
  if (!session) return res.status(404).json({ message: "Bot não encontrado" });
  const client = Instagram.getUser();
  const ready = !!client;
  res.json({
    ready,
    ...(client
      ? {
          username: client.username,
          fullName: client.fullName,
          href: `https://instagram.com/${client.username}`,
          avatarURL: client.avatarURL,
        }
      : {}),
  });
});
route.get("/whatsapp/turn-off", async (req, res) => {
  if (!WhatsappBot.getReady()) return res.json({ ok: true });

  WhatsappBot.removeSession().then(async () => {
    await WhatsappBot.getClient().logout();
    await WhatsappBot.getClient().close();
    await WhatsappBot.getClient().connect();
    res.json({ ok: true });
  });
});
route.get("/instagram/turn-off", async (req, res) => {
  const client = Instagram.getClient();
  if (client) {
    await Instagram.logout();
  }
  return res.json({ ok: true });
});
route.post("/instagram/turn-on", async (req, res) => {
  try {
    const newSession = await Instagram.login(req.body);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(e.status || 400).json({
      message: e.message || "Um erro ocorreu ao tentar logar no Instagram",
    });
  }
});
