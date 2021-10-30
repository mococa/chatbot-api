import { Schema, model } from "mongoose";
import { WhatsappChannel } from "./whatsapp-channel";

const Bot = new Schema({
  core: WhatsappChannel,
});

export const BotModel = model("bots", Bot, "bots");
