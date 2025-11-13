import { Telegraf, Markup } from "telegraf";
import { message } from "telegraf/filters";
import messageBot from "./messageBot.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bot = new Telegraf(process.env.KeyTgBot!);

const adminId: number[] = [1234664472, 7929235654, 1785831984];

bot.start((ctx) => {
  try {
    const keyboard = Markup.keyboard(messageBot.startKeyboard).resize();
    const inlineKeyboard = Markup.inlineKeyboard([
      [Markup.button.callback("Мой ID", "myId"), Markup.button.callback("Проверка аккаунта", "accountVerification")],
    ]);
    ctx.reply(messageBot.hiMsg, inlineKeyboard);
    return ctx.reply("Основное меню:", keyboard);
  } catch (err) {
    errorBot(err);
  }
});

bot.hears("🌐 Наш сайт", (ctx) => {
  try {
    return ctx.replyWithPhoto(
      { source: path.join(__dirname, "pw.jpg") },
      {
        caption: messageBot.msgOurWebsite,
      }
    );
  } catch (err) {
    errorBot(err);
  }
});
bot.hears("🎧 Тех. Поддержка", (ctx) => {
  try {
    return ctx.reply(messageBot.msgSupport);
  } catch (err) {
    errorBot(err);
  }
});
bot.action("myId", (ctx) => {
  try {
    ctx.answerCbQuery();
    ctx.reply(`Твой ID: ${ctx.update.callback_query.from.id}`);
  } catch (err) {
    errorBot(err);
  }
});
bot.action("accountVerification", (ctx) => {
  try {
    const idUser = ctx.update.callback_query.from.id;
    const find = adminId.find((value) => value == idUser);
    if (typeof find == "undefined") {
      ctx.reply("❌ Ваш ID не зарегистрирован в базе, поэтому вы не будете получать уведомления от этого бота.");
    } else {
      const inlineKeyboard = Markup.inlineKeyboard([[Markup.button.callback("Проверка", "test")]]);
      ctx.reply("✅ Ваш аккаунт активен.", inlineKeyboard);
    }
    ctx.answerCbQuery();
  } catch (err) {
    errorBot(err);
  }
});
bot.action("test", (ctx) => {
  try {
    tt();
    ctx.answerCbQuery();
    ctx.reply(`Через 5 сек всем будет отправлено сообщение.`);
  } catch (err) {
    errorBot(err);
  }
});
async function sendAll(msg: string) {
  for (const item of adminId) {
    try {
      await bot.telegram.sendMessage(item, msg);
    } catch (err) {
      errorBot(err);
    }
  }
  // setTimeout(async () => await bot.telegram.sendMessage(7929235654, "dd"), 5000);
}
function errorBot(msg: any) {
  console.log(`[botTG-Error]: ${msg}`);
}

async function tt() {
  setTimeout(async () => await sendAll("Тест"), 5000);
}

export default bot;
