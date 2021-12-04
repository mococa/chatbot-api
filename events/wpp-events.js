import { MessageType, ReconnectMode } from "@adiwajshing/baileys";
import { WhatsappBot } from "../controllers/whatsapp";
import QRCode from "qrcode";
import { Chatbot } from "../controllers/bot-general";
import { jidToPhone, phoneToJid, sleep } from "../helpers";
import { Client } from "../controllers/client";
import { ClientModel } from "../models/client";
import { SettingsModel } from "../models/settings";
let jid = null;
const test_numbers = ["21982869775", "21993593730"];
// const test_message = "Oi";
// const test_reply = "Olá";

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

  connection.on("chat-update", async (chat_update) => {
    if (!(chat_update.messages && chat_update.count)) return;
    try {
      await sleep(300);
      const data = chat_update.messages?.all()[0];
      jid = data?.key?.remoteJid;
      const message = data?.message?.conversation;
      if (!test_numbers.some((test_number) => jid.includes(test_number))) {
        return;
      }
      //if (jid === phoneToJid(test_number)) {
      const customer = jid;
      const client = await Client.findByPhone(jidToPhone(jid));
      const session = Chatbot.findSession(customer);
      if (client) {
        if (session) {
          Chatbot.answerQuestion({ message, customer });
          Chatbot.onSessionEnd(customer, async (session) => {
            console.log({ session });
            reply(JSON.stringify(session));
          });
        } else {
          const questions = ["Pergunta 1:", "Pergunta 2"];
          Chatbot.createSession({
            customer,
            allQuestions: questions,
          });
          const new_session = Chatbot.findSession(customer);
          reply(new_session.allQuestions[0]);
        }
      } else {
        if (session) {
          Chatbot.answerQuestion({ message, customer });
          Chatbot.onSessionEnd(customer, async (session) => {
            const imgUrl = await connection.getProfilePicture(jid);
            await ClientModel.create({
              name: session.message[0],
              email: session.message[1],
              picture: imgUrl,
              phone: jidToPhone(jid),
              channels: ["whatsapp"],
            });
            reply("Seu usuário foi criado com sucesso");
          });
        } else {
          const settings = await SettingsModel.findOne({});
          const welcome = (settings.welcome?.length && settings.welcome) || [
            "Digite seu nome:",
            "Digite seu e-mail",
          ];
          Chatbot.createSession({
            customer,
            allQuestions: welcome,
          });
          const new_session = Chatbot.findSession(customer);
          reply(new_session.allQuestions[0]);
        }
      }
      // if (session && !client) {
      //   Chatbot.answerQuestion({ message, customer });
      //   Chatbot.onSessionEnd(customer, async (session) => {
      //     const imgUrl = await connection.getProfilePicture(jid);
      //     await ClientModel.create({
      //       name: session.message[0],
      //       age: session.message[1],
      //       email: session.message[2],
      //       picture: imgUrl,
      //       phone: jidToPhone(jid),
      //       channels: ["whatsapp"],
      //     });
      //     reply("Seu usuário foi criado com sucesso");
      //   });
      // } else {
      //   let questions = [
      //     "Bem vindo ao BOT da familia tradicional brasileira... Para começar, preciso que você indique o seu nome. to esperando, vai...",
      //     "Uui!, que nome bonitinho... rsrsrsrsr... agora sua idade........",
      //     "entendi! agora me diz seu email aí porra!",
      //   ];
      //   if (client)
      //     questions = [
      //       `Oi, ${client.name}, esse é vc?? ${imgUrl}`,
      //       `Tudo bem? Eu sei que vc tem ${client.age} anos`,
      //       `E aí, blz, ${client.email} ?`,
      //     ];
      //   if (!session)
      //     Chatbot.createSession({
      //       customer,
      //       allQuestions: questions,
      //     });
      //   const new_session = Chatbot.findSession(customer);
      //   reply(new_session.allQuestions[0]);
      // }
      //}
      //console.log({ message, jid });
      //connection?.chatRead();
      // if (jid === `${test_number}@s.whatsapp.net`) {
      //   if (message === test_message) reply(test_reply);
      // }
    } catch (error) {
      console.error({ error });
    }
  });
};
function reply(msg = "") {
  WhatsappBot.getClient()?.sendMessage(jid, msg, MessageType.text);
}
