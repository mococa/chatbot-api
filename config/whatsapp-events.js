import { WhatsappBot } from "../controllers/whatsapp";
import { whatsappEvents } from "../events/whatsapp";
import { Client } from "whatsapp-web.js";

export const configure_client = async (session) => {
  let client;
  try {
    if (session) {
      client = new Client({
        session: typeof session === "string" ? JSON.parse(session) : session,
      });
    } else {
      client = new Client();
    }
    WhatsappBot.setClient(client);
    whatsappEvents(client);
    await client.initialize();
  } catch (err) {
    console.error(err);
  } finally {
    return client || null;
  }
};
