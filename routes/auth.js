import { Router } from "express";
import { User } from "../controllers/users";
import { errorHandler } from "../helpers";

export const auth_route = Router();
const route = auth_route;

route.get("/", (req, res) => {
  return res.send("rota raiz auth");
});
route.post("/signup", async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.json(user);
  } catch (err) {
    return errorHandler(err, res);
  }
});
