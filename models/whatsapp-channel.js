import { model, Schema } from "mongoose";

export const WhatsappChannel = new Schema({
  _id: false,
  channel: {
    type: String,
    default: "whatsapp",
  },
  session: String,
});
//export const WhatsappChannelModel = model("whatsappChannel", WhatsappChannel);
