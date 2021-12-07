import { MessageType, ReconnectMode } from "@adiwajshing/baileys";
import { WhatsappBot } from "../controllers/whatsapp";
import QRCode from "qrcode";
import { Chatbot } from "../controllers/bot-general";
import { jidToPhone, phoneToJid, sleep } from "../helpers";
import { Client } from "../controllers/client";
import { ClientModel } from "../models/client";
import { SettingsModel } from "../models/settings";
import { Question } from "../controllers/question";
import { FormModel } from "../models/forms";
import { ObjectId } from "bson";
let jid = null;
const test_numbers = [
  "21982869775",
  "21993593730",
  "21979262249",
  "4198712624",
];

export const handle_wpp_events = (connection, session) => {
  connection.connectOptions.logQR = false;
  connection.connectOptions.connectCooldownMs = 10000;
  connection.connectOptions.maxIdleTimeMs = 10000;
  connection.connectOptions.maxRetries = 100000;
  connection.connectOptions.alwaysUseTakeover = true;
  connection.autoReconnect = ReconnectMode.onAllErrors;
  connection.logger.level = "error";
  connection.connectOptions.shouldLogMessages = false;
  connection.browserDesription = ["Gema", "Chrome", "10.0"];
  connection.version = [2, 2142, 12];

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
      console.log("disconnected", { error: er, when: new Date() });
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

      const customer = jid;
      const client = await Client.findByPhone(jidToPhone(jid));
      const session = Chatbot.findSession(customer);
      if (client && !client.answered?.answered) {
        if (session) {
          Chatbot.answerQuestion({ message, customer }, async (session) => {
            await FormModel.create({
              questions: session.questions.map((question) =>
                String(question.question)
              ),
              answers: session.answers,
              client: client._id,
            });
            client.answered = {
              answered: true,
              at: new Date(),
            };
            await client.save();
            const settings = await SettingsModel.findOne({});
            const goodbye =
              settings.goodbye ||
              "Obrigado. Entraremos em contato o mais breve possível";
            reply(goodbye);
          });
        } else {
          const settings = await SettingsModel.findOne({});
          if (settings.askQuestions) {
            const questions = await Question.get();
            Chatbot.createSession({
              customer,
              questions,
            });
            //? Creates session and asks first form question of it to existing client
            const new_session = Chatbot.findSession(customer);
            reply(new_session.questions[0].question);
          }
        }
      } else {
        if (client) return;
        if (session) {
          Chatbot.answerQuestion({ message, customer }, async (session) => {
            const imgUrl = await connection
              .getProfilePicture(jid)
              .catch(() => null);
            await ClientModel.create({
              name: session.answers[0],
              email: session.answers[1],
              ...(imgUrl && { picture: imgUrl }),
              phone: jidToPhone(jid),
              channels: ["whatsapp"],
            });
            const settings = await SettingsModel.findOne({});
            const feedback = settings.feedback || "Usuário criado com sucesso";
            reply(feedback);
          });
        } else {
          const settings = await SettingsModel.findOne({});
          const welcome = (settings.welcome?.length && settings.welcome) || [
            { question: "Digite seu nome:", type: "free" },
            { question: "Digite seu e-mail", type: "e-mail" },
          ];
          Chatbot.createSession({
            customer,
            questions: [
              { question: welcome[0], type: "free" },
              { question: welcome[1], type: "e-mail" },
            ],
          });
          const new_session = Chatbot.findSession(customer);
          reply(new_session.questions[0].question);
        }
      }
    } catch (error) {
      console.error({ error });
    }
  });
};
function reply(msg = "") {
  WhatsappBot.getClient()?.sendMessage(jid, msg, MessageType.text);
}
