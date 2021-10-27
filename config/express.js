import cookieParser from "cookie-parser";
import { router } from "../routes";

export const expressConfig = (express, app) => {
  app.use(cookieParser());
  app.use(express.json());
  app.use(router);
};
