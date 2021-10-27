import cookieParser from "cookie-parser";
import { router } from "../routes";
import cors from "cors";
export const expressConfig = (app) => {
  app.use(
    cors({
      origin: ["http://localhost:3000"],
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(router);
};
