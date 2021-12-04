import { Router } from "express";
import { Question } from "../controllers/question";
import { errorHandler } from "../helpers";
import { check_authentication } from "../middlewares/authenticate";

export const questions_route = Router();
const route = questions_route;

route.get("/", check_authentication, async (req, res) => {
  const blocks = await Question.get();
  return res.json(blocks);
});
route.post("/", check_authentication, async (req, res) => {
  try {
    const blocks = await Question.create(req.body, req.user_id);
    return res.json(blocks);
  } catch (err) {
    return errorHandler(err, res);
  }
});
route.put("/", check_authentication, async (req, res) => {
  try {
    const questions = await Question.reorder(req.body);
    return res.json(questions);
  } catch (err) {
    return errorHandler(err, res);
  }
});
route.put("/:id", check_authentication, async (req, res) => {
  try {
    const blocks = await Question.edit({ ...req.body, ...req.params });
    return res.json(blocks);
  } catch (err) {
    return errorHandler(err, res);
  }
});
route.delete("/:id", check_authentication, async (req, res) => {
  try {
    const questions = await Question.delete(req.params);
    return res.json(questions);
  } catch (err) {
    return errorHandler(err, res);
  }
});
