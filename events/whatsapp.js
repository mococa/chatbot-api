import { WhatsappBot } from "../controllers/whatsapp";
import QRCode from "qrcode";
import { configure_client } from "../config/whatsapp-events";
export const whatsappEvents = (client) => {
  client.on("auth_failure", () => {
    console.error("WhatsApp Bot: failed to authenticate");
    WhatsappBot.setQR(null);
    WhatsappBot.setReady(false);
    WhatsappBot.setLoggedIn(false);
  });
  client.on("disconnected", async () => {
    console.info("WhatsApp Bot: disconnected");
    WhatsappBot.setQR(null);
    WhatsappBot.setLoggedIn(false);
    WhatsappBot.setReady(false);
    WhatsappBot.removeSession().then(() => {
      client = configure_client();
    });
  });
  client.on("authenticated", (session) => {
    console.info("WhatsApp Bot: authorized");
    WhatsappBot.storeSession(JSON.stringify(session)).then(() => {
      WhatsappBot.setQR(null);
      WhatsappBot.setLoggedIn(true);
      WhatsappBot.setReady(true);
    });
  });
  client.on("qr", (qr) => {
    console.log("WhatsApp Bot: new QR code generated");
    //WhatsappBot.setReady(false);
    QRCode.toDataURL(qr).then((qrcode) => {
      WhatsappBot.setQR(qrcode);
    });
  });
  client.on("ready", () => {
    console.info("WhatsApp Bot: ready");
    WhatsappBot.setReady(true);
  });
  client.on("message", async (message) => {
    try {
      const contact = await message.getContact().catch(() => message.author);
      const chat = await message.getChat();
      const picture = (await contact.getProfilePicUrl().catch(() => "")) || "";
      const text = message.body;
      const displayName =
        contact?.pushname || contact?.name || contact?.shortName || "";
      const number = contact?.number || "";
      const when = new Date((message.timestamp || 0) * 1000);
      const quotedMessage = await message.getQuotedMessage();
      const answeredMessage = message.hasQuotedMsg
        ? { message: quotedMessage.body, answer: text }
        : null;
      console.log({
        picture,
        text,
        displayName,
        number,
        when,
        answeredMessage,
      });
    } catch (e) {
      console.error(e);
    }
  });
};
