import { Router } from "express";
import { Block } from "../controllers/block";
import { errorHandler } from "../helpers";
import { check_authentication } from "../middlewares/authenticate";

export const blocks_route = Router();
const route = blocks_route;

route.get("/", async (req, res) => {
  const blocks = await Block.get(req.user_id);
  return res.json(blocks);
});
route.post("/create", check_authentication, async (req, res) => {
  try {
    const blocks = await Block.create(req.body, req.user_id);
    return res.json(blocks);
  } catch (err) {
    console.error(err);
    return errorHandler(err, res);
  }
});
route.put("/edit/:id", async (req, res) => {
  try {
    const blocks = await Block.edit(
      { ...req.body, ...req.params },
      req.user_id
    );
    return res.json(blocks);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
});
