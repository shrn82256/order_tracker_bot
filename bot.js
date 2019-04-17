const TelegramBot = require("node-telegram-bot-api");
const scrapper = require("./scrapper");
const packageInfo = require("./package.json");

const token = process.env.TELEGRAM_API_TOKEN;
global.current_chat_id = -1;
global.current_data = "";

const bot = new TelegramBot(token, { polling: true });

setInterval(function() {
  scrapper.then(data => {
    if (data != global.current_data && global.current_chat_id != -1) {
      global.current_data = data;
      bot.sendMessage(global.current_chat_id, data);
    }
  });
}, 1000 * 60 * 5);

bot.on("message", msg => {
  const { text } = msg;

  var reply = "Hey!\n";

  if (text === "Start") {
    reply += `started\t${packageInfo.version}\n`;
    reply += `current\t${global.current_chat_id}\n`;
    reply += `new\t${msg.chat.id}\n`;

    bot.sendMessage(msg.chat.id, reply);
    global.current_chat_id = msg.chat.id;
  } else if (text === "Status") {
    scrapper.then(data => {
      reply += data;
      bot.sendMessage(msg.chat.id, reply);
    });
    // bot.sendPhoto(msg.chat.id, __dirname + "/sample.jpg");
  } else {
    reply += text;
    bot.sendMessage(msg.chat.id, reply);
  }
});

module.exports = bot;
