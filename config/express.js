import cookieParser from "cookie-parser";
import { router } from "../routes";
import cors from "cors";
export const expressConfig = (app) => {
  app.use(
    cors({
      origin: (domain, callback) => {
        if (process.env.NODE_ENV === "production") {
          if (domain && domain !== process.env.FRONT_END) {
            console.error({ blockedDomain: domain });
            return callback(
              "Por favor, requisições HTTP devem ser feitas pelo site"
            );
          }
        }
        callback(null, true);
      },
      credentials: true,
      sameSite: "none",
    })
  );
  app.use(cookieParser());
  app.use(router);
};
