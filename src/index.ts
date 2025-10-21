import express, { type Response, Request } from "express";
import router from "./router/router.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const app = express();
app.use(express.json());
app.use(router);

app.listen(process.env.PORT ? process.env.PORT : 3000, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${process.env.PORT ? process.env.PORT : 3000}`);
});
