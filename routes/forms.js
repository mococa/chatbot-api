import { Router } from "express";
import { isValidObjectId, mongo } from "mongoose";
import { FormModel } from "../models/forms";

export const forms_route = Router();
const route = forms_route;

route.get("/", async (req, res) => {
  const forms = await FormModel.find({}).populate(["client"]);
  return res.json(forms);
});
route.get("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ message: "ID inválido" });
  const forms = await FormModel.find({
    client: mongo.ObjectId(req.params.id),
  }).populate(["client"]);
  return res.json(forms);
});
