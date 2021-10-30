import { Router } from "express";
import { auth_route } from "./auth";
import { blocks_route } from "./blocks";
import { whatsapp_route } from "./whatsapp";

export const router = Router()
  .use("/auth", auth_route)
  .use("/blocks", blocks_route)
  .use("/whatsapp", whatsapp_route);
