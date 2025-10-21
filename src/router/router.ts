import express, { type Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import api from "./API/API.js";
const router = express.Router();

router.use("/api", api);

router.use("/", (req: Request, res: Response) => {
  res.sendFile(path.join(path.join(__dirname, "..", "/frontend", "index.html")));
});

export default router;
