import { WhatsappBot } from "../controllers/whatsapp";
import QRCode from "qrcode";
import { configure_client } from "../config/whatsapp-events";
export const whatsappEvents = (client) => {
  client.on("auth_failure", () => {
    console.error("WhatsApp Bot: failed to authenticate");
    WhatsappBot.setQR(null);
    WhatsappBot.setLoggedIn(false);
  });
  client.on("disconnected", async () => {
    console.info("WhatsApp Bot: disconnected");
    WhatsappBot.setQR(null);
    WhatsappBot.setLoggedIn(false);
    WhatsappBot.removeSession().then(() => {
      client = configure_client();
    });
  });
  client.on("authenticated", (session) => {
    console.info("WhatsApp Bot: authorized");
    WhatsappBot.setQR(null);
    WhatsappBot.setLoggedIn(true);
    WhatsappBot.storeSession(JSON.stringify(session));
  });
  client.on("qr", (qr) => {
    console.log("WhatsApp Bot: new QR code generated");
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
      const picture = (await contact.getProfilePicUrl().catch(() => "")) || "";
      const text = message.body;
      const displayName =
        contact?.pushname || contact?.name || contact?.shortName || "";
      const number = contact?.number || "";
      const when = new Date((message.timestamp || 0) * 1000);

      console.log({ picture, text, displayName, number, when });
    } catch (e) {
      console.error(e);
    }

    // const chat = await message.getChat();
    // chat.sendStateTyping();
    // setTimeout(() => {
    //   if (contact.name === "Mãe") {
    //     //message.reply("escute o filho sábio imediatamente");
    //   }
    //   chat.clearState();
    // }, 1500);
    // const getInfo = await message.getInfo();
    // console.log({ contact, getInfo, getPp });
  });
};
