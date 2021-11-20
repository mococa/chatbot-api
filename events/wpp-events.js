import { MessageType, ReconnectMode } from "@adiwajshing/baileys";
import { WhatsappBot } from "../controllers/whatsapp";
import QRCode from "qrcode";
let jid = null;
const test_number = "554198712624";
const test_message = "Oi";
const test_reply = "Olá";

export const handle_wpp_events = (connection, session) => {
  connection.connectOptions.logQR = false;
  connection.connectOptions.connectCooldownMs = 10000;
  connection.connectOptions.maxIdleTimeMs = 10000;
  connection.connectOptions.maxRetries = 100000;
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
    WhatsappBot.removeSession().then(() => {
      console.log("disconnected", { er });
      connection.connectOptions.connectCooldownMs = 1000;
      setTimeout(() => {
        connection.connectOptions.connectCooldownMs = 10000;
      }, 1000);
    });
  });

  connection.on("chat-update", (chat_update) => {
    if (!(chat_update.messages && chat_update.count)) return;
    try {
      const data = chat_update.messages?.all()[0];
      jid = data?.key?.remoteJid;
      const message = data?.message?.conversation;
      if (message === "!ping") reply("pong!");
      //console.log({ message, jid });
      //connection?.chatRead();
      if (jid === `${test_number}@s.whatsapp.net`) {
        if (message === test_message) reply(test_reply);
      }
    } catch (e) {
      console.error(e);
    }
  });
};
function reply(msg = "") {
  WhatsappBot.getClient()?.sendMessage(jid, msg, MessageType.text);
}
