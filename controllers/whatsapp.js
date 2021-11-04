import { BotModel } from "../models/bot";
export class WhatsappBot {
  client = null;
  qr = null;
  ready = false;
  loggedIn = false;

  static getLoggedIn() {
    return this.loggedIn;
  }
  static setLoggedIn(loggedIn) {
    this.loggedIn = loggedIn;
    return this.getLoggedIn();
  }
  static async getSession() {
    const bot = await BotModel.findOne({ "session.channel": "whatsapp" });
    return bot?.core?.session ? JSON.parse(bot?.core?.session) : null;
  }
  static getInfo() {
    if ((!this.client && !this.client.user) || this.client?.state === "close")
      return null;
    console.log(this.client)
    return {
      number: this.client?.user?.jid?.split("@")[0],
      name: this.client?.user?.name,
      phone: {
        name: this.client?.user?.phone?.device_manufacturer,
      },
    };
  }
  static async storeSession(session) {
    const bot = await BotModel.findOne({ "core.channel": "whatsapp" });
    if (bot && session) {
      console.info("WhatsApp Bot: returning to session");
      bot.core.session = JSON.stringify(session);
      await bot.save();
      return bot;
    }
    console.info("WhatsApp Bot: Creating session");
    const whatsappChannelModel = {
      session: JSON.stringify(session),
    };
    const createdBot = await BotModel.create({
      core: whatsappChannelModel,
    });
    return createdBot;
  }
  static async removeSession() {
    await BotModel.deleteOne({ "core.channel": "whatsapp" });
    //this.client = await configure_client();
    this.setLoggedIn(false);
    this.setReady(false);
    return this.client;
  }
  static setClient(client) {
    this.client = client;
    return this.getClient();
  }
  static getClient() {
    return this.client;
  }
  static getQR() {
    return this.qr;
  }
  static setQR(qr) {
    this.qr = qr;
    return this.getQR();
  }
  static getReady() {
    return this.ready;
  }
  static setReady(ready) {
    this.ready = ready;
    this.setQR(null);
    this.setLoggedIn(true);
    return this.getReady();
  }
}
