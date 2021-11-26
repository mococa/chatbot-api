import { Router } from "express";
import { User } from "../controllers/users";
import { createToken, errorHandler } from "../helpers";

export const auth_route = Router();
const route = auth_route;

route.get("/", async (req, res) => {
  try {
    const user = await User.getByToken(req.cookies["jwt"]);
    return res.json(user);
  } catch (err) {
    return errorHandler(err, res);
  }
});
route.post("/login", async (req, res) => {
  try {
    const user = await User.login(req.body);
    createToken(user, res);
    return res.json(user);
  } catch (err) {
    errorHandler(err, res);
  }
});
route.post("/sign-up", async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.json(user);
  } catch (err) {
    return errorHandler(err, res);
  }
});