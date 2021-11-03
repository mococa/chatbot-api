require("dotenv").config();
import { WAConnection } from "@adiwajshing/baileys";
import express from "express";
import { connection } from "./config/db-script";
import { expressConfig } from "./config/express";
import { configure_client } from "./config/whatsapp-events";
import { clientNew } from "./events/wpp-events";
import { WhatsappBot } from "./controllers/whatsapp";
let client = null;
let conn = null;

const app = express();
app.use(express.json());
expressConfig(app);

app.get("/", (req, res) => {
  return res.send("rota /");
});

app.listen(process.env.PORT || 8080, () => {
  connection().then(async () => {
    const session = await WhatsappBot.getSession();
    try {
      console.info("WhatsApp Bot: warming up");
      conn = new WAConnection();
      clientNew(conn, session);
      await conn.connect();
    } catch (e) {
      console.error(e);
    }
  });
  console.log("App started 🚀 at port " + process.env.PORT || 8080);
});
