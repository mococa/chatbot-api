require("dotenv").config();
import express from "express";
import { connection } from "./config/db-script";
import { expressConfig } from "./config/express";
import { configure_client } from "./config/whatsapp-events";
import { WhatsappBot } from "./controllers/whatsapp";
let client = null;

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
      client = configure_client(session);
    } catch (e) {
      console.error(e);
    }
  });
  console.log("App started 🚀 at port " + process.env.PORT || 8080);
});
