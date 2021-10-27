require("dotenv").config();
import express from "express";
import { connection } from "./config/db-script";
import { expressConfig } from "./config/express";
const app = express();
app.use(express.json());
expressConfig(app);

app.get("/", (req, res) => {
  return res.send("rota /");
});

app.listen(process.env.PORT, () => {
  connection();
  console.log("tamo on");
});
