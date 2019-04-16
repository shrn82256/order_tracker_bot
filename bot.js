const token = process.env.TELEGRAM_API_TOKEN;

const Bot = require("node-telegram-bot-api");
let bot;

if (process.env.NODE_ENV === "production") {
  bot = new Bot(token);
  console.log(process.env.HEROKU_URL + bot.token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new Bot(token, { polling: true });
}

console.log("Bot server started in the " + process.env.NODE_ENV + " mode");

bot.on("message", msg => {
  const name = msg.from.first_name;
  console.log(msg);
  bot.sendMessage(msg.chat.id, "Hello, " + name + "!").then(() => {
    // reply sent!
  });
});

module.exports = bot;
