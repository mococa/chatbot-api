import { Schema, model } from "mongoose";

const Bot = new Schema({
  channel: {
    type: String,
    enum: ["whatsapp", "instagram"],
    required: [true, "Bot channel is required"],
  },
  session: String,
});

export const BotModel = model("bots", Bot, "bots");
