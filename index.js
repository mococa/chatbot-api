require("dotenv").config();
import express from "express";
import { WAConnection } from "@adiwajshing/baileys";
import { connection } from "./config/db-script";
import { expressConfig } from "./config/express";
import { handle_wpp_events } from "./events/wpp-events";
import { WhatsappBot } from "./controllers/whatsapp";
import { withRealtime } from "instagram_mqtt";
import { IgApiClient } from "instagram-private-api";
import { handle_ig_events } from "./events/insta-events";
import { Instagram } from "./controllers/instagram";
import Insta from "@androz2091/insta.js";
import { BotModel } from "./models/bot";
import { schedules } from "./schedules";
import { Chatbot } from "./controllers/bot-general";

const app = express();
app.use(express.json());

expressConfig(app);

app.get("/", (req, res) => {
  return res.send("rota /");
});

app.listen(process.env.PORT || 8080, () => {
  connection().then(async () => {
    try {
      schedules();
      console.info("WhatsApp Bot: warming up");
      //! Needs to disable DM requests!
      //* https://www.instagram.com/push/web/settings/

      //await instagramConnection();
      await whatsAppConnection();
    } catch (e) {
      console.error(e);
    }
  });
  async function whatsAppConnection() {
    Chatbot.setAnswering(true);
    const session = await WhatsappBot.getSession();
    const client = new WAConnection();
    handle_wpp_events(client, session);
    try {
      client.connect().catch(whatsAppConnection);
    } catch (err) {
      client.connect().catch(whatsAppConnection);
    }
  }
  async function instagramConnection({ username, password }) {
    try {
      console.info("Connecting Instagram BOT");
      const client = new Insta.Client({
        disableReplyPrefix: true,
      });
      Instagram.setClient(client);
      handle_ig_events(client);
      const { IG_USERNAME, IG_PASSWORD } = process.env;
      const bot = await BotModel.findOne({ channel: "instagram" });
      const session = (bot && JSON.parse(bot.session)) || null;
      const errorHandle = (err) => {
        console.error(
          `Failed to log into Instagram due to 👇\n${err.message}\nTrying again in 20s`
        );
        setTimeout(instagramConnection, 20000);
      };
      if (session) {
        console.log("session found. returning to instagram");
        client.login(IG_USERNAME, IG_PASSWORD, session).catch(errorHandle);
      } else {
        console.log("session not found. trying to log in");
        client.login(IG_USERNAME, IG_PASSWORD).catch(errorHandle);
      }
    } catch (err) {
      console.error("failed connecting to instagram");
      if (Instagram.getClient()) await Instagram.getClient().logout();
      instagramConnection();
    }
  }
  console.log("App started 🚀 at port " + process.env.PORT || 8080);
});
