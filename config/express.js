import cookieParser from "cookie-parser";
import { router } from "../routes";
import cors from "cors";
export const expressConfig = (app) => {
  app.use(
    cors({
      origin: [process.env.FRONT_END],
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(router);
};
