import { Router } from "express";
import { auth_route } from "./auth";
import { blocks_route } from "./blocks";

export const router = Router()
  .use("/auth", auth_route)
  .use("/blocks", blocks_route);
