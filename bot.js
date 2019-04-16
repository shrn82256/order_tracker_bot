const token = process.env.TELEGRAM_API_TOKEN;

const Bot = require("node-telegram-bot-api");
let bot;

global.currentChatId = -1;
global.currentBody = "";
global.count = 0;

if (process.env.NODE_ENV === "production") {
  bot = new Bot(token);
  console.log(process.env.HEROKU_URL + bot.token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new Bot(token, { polling: true });
}

console.log("Bot server started in the " + process.env.NODE_ENV + " mode");

bot.on("message", msg => {
  if (msg.txt == "Start") {
    global.currentChatId = msg.chat.id;
    bot.sendMessage(msg.chat.id, "started");
  } else if (msg.txt == "Status") {
    bot.sendPhoto(msg.chat.id, __dirname + "/sample.jpg");
  } else {
    bot.sendMessage(msg.chat.id, msg.text);
  }
});

module.exports = bot;
