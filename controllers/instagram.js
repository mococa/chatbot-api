import { handle_ig_events } from "../events/insta-events";
import { BotModel } from "../models/bot";
import Insta from "@androz2091/insta.js";

export class Instagram {
  client = null;
  qr = null;
  ready = false;
  loggedIn = false;
  user = null;
  static setClient(client) {
    this.client = client;
    return this;
  }
  static getUser() {
    return this.user;
  }
  static setUser(user) {
    this.user = user;
  }
  static getClient() {
    return this.client;
  }
  static getLoggedIn() {
    return this.loggedIn;
  }
  static setLoggedIn(loggedIn) {
    this.loggedIn = loggedIn;
    return this.getLoggedIn();
  }
  static async getSession() {
    const bot = await BotModel.findOne({ channel: "instagram" });
    if (!bot?.session) {
      console.error({
        message: "Intagram session not found",
      });
      return null;
    }
    const session = JSON.parse(bot.session);
    //await this.getClient().importState(session);
    return session;
  }
  static async storeSession(session) {
    const bot = await BotModel.findOne({ channel: "instagram" });
    if (bot && session) {
      console.info("Instagram Bot: returning to session");
      bot.session = session;
      await bot.save();
      return bot;
    }
    console.info("Instagram Bot: Creating session");
    const channelModel = {
      session,
      channel: "instagram",
    };
    const createdBot = await BotModel.create(channelModel);
    return createdBot;
  }
  static async login({ username, password }) {
    const session = await this.getSession();
    if ((!username || !password) && !session)
      throw {
        message: "Por favor, preencha todos os campos necessários",
      };
    if (this.getClient() && this.getClient().ready) {
      await this.logout();
    }
    console.info("Connecting Instagram BOT");
    const client =
      this.getClient() ||
      new Insta.Client({
        disableReplyPrefix: true,
      });
    this.setClient(client);
    handle_ig_events(client);

    if (session) {
      console.log("Instagram BOT: session found");
      return await client.login(username, password, session); //.catch(errorHandle);
    } else {
      console.log("Instagram BOT: session not found");
      return await client.login(username, password); //.catch(errorHandle);
    }
  }
  static async logout() {
    console.info("Instagram BOT: Logging out");
    await BotModel.findOneAndRemove({ channel: "instagram" });
    await this.getClient().logout();
  }
}
