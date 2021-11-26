import { Router } from "express";
import { auth_route } from "./auth";
import { questions_route } from "./questions";
import { bot_route } from "./bot";

export const router = Router()
  .use("/auth", auth_route)
  .use("/questions", questions_route)
  .use("/bot", bot_route);
