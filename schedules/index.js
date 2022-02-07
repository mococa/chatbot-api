import schedule from "node-schedule";
import { Chatbot } from "../controllers/bot-general";
import { SettingsModel } from "../models/settings";

export const schedules = () =>
  schedule.scheduleJob("*/1 * * * *", async function () {
    const settings = await SettingsModel.findOne({});
    const answering = settings.askQuestions;
    Chatbot.setAnswering(answering);
  });
