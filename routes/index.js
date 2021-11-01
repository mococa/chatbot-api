import { Router } from "express";
import { auth_route } from "./auth";
import { blocks_route } from "./blocks";
import { bot_route } from "./bot";

export const router = Router()
  .use("/auth", auth_route)
  .use("/blocks", blocks_route)
  .use("/bot", bot_route);
