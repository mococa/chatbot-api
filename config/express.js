import { router } from "../routes";

export const expressConfig = (express, app) => {
  app.use(express.json());
  app.use(router);
};
