import { ReconnectMode } from "@adiwajshing/baileys";
import { WhatsappBot } from "../controllers/whatsapp";
import QRCode from "qrcode";

export const handle_wpp_events = (connection, session) => {
  //connection.connectOptions.logQR = false;
  connection.connectOptions.connectCooldownMs = 10000;
  connection.connectOptions.maxIdleTimeMs = 10000;
  connection.connectOptions.maxRetries = 3;
  connection.connectOptions.alwaysUseTakeover = true;
  connection.autoReconnect = ReconnectMode.onAllErrors;
  connection.logger.level = "error";
  connection.connectOptions.shouldLogMessages = false;
  connection.version = [2, 2140, 12];

  if (session) {
    connection.loadAuthInfo(session);
  }
  connection.on("qr", (qr) => {
    QRCode.toDataURL(qr).then((qrcode) => {
      WhatsappBot.setQR(qrcode);
    });
  });
  connection.on("connecting", () => {
    console.log("connecting");
  });
  connection.on("open", () => {
    WhatsappBot.setClient(connection);
    WhatsappBot.setReady(true);
    const authInfo = connection.base64EncodedAuthInfo();
    WhatsappBot.storeSession(authInfo).then(() => {
      console.log("session stored");
    });
  });
  connection.on("close", (er) => {
    console.log("disconnected", { er });
    connection.connectOptions.connectCooldownMs = 1000;
    setTimeout(() => {
      connection.connectOptions.connectCooldownMs = 10000;
    }, 1000);
  });
  connection.on("chat-new", (chat) => {
    console.log({ chat });
  });
  connection.on("chat-update", (chat_update) => {
    console.log({
      chat_update: (chat_update.messages?.array || [])[0]?.message,
    });
  });
};
