import express, { type Response, Request } from "express";
import router from "./router/router.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import bot from "./tgBot/tgBotController.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
await isValidENV();

const app = express();
app.use(express.json());
app.use(router);
app.use(errorMiddleware);

app.listen(process.env.PORT ? process.env.PORT : 3000, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${process.env.PORT ? process.env.PORT : 3000}`);
});
bot.launch();

async function isValidENV() {
  let errorEnv: string[] = [];
  if (!process.env.SecretKey || !process.env.PublicKey) errorEnv.push("Нет ключей в env");
  if (!process.env.DomenErp) errorEnv.push("Укажи домен ERP в env");
  if (!process.env.KeyTgBot) errorEnv.push("Нужен токен TG бота");

  if (errorEnv.length != 0) {
    for (let item of errorEnv) {
      console.log(item);
    }
    process.exit();
  }
}
