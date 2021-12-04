import { Router } from "express";
import { auth_route } from "./auth";
import { questions_route } from "./questions";
import { bot_route } from "./bot";
import { client_route } from "./client";
import { settings_route } from "./settings";

export const router = Router()
  .use("/auth", auth_route)
  .use("/questions", questions_route)
  .use("/bot", bot_route)
  .use("/clients", client_route)
  .use("/settings", settings_route);
