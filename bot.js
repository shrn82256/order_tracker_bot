const token = process.env.TELEGRAM_API_TOKEN;
const puppeteer = require("puppeteer");

const Bot = require("node-telegram-bot-api");
let bot;

global.currentChatId = -1;
global.currentBody = "";
global.count = 0;

var intervalID = setInterval(() => {
  console.log("Hello World!");
  (async ({ EMAIL, PASSWORD, REDIRECT }) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.cubelelo.com/login");

    await page.waitFor(`input[name="email"]`);
    await page.$eval(
      `input[name="email"]`,
      (el, value) => (el.value = value),
      EMAIL
    );
    await page.waitFor(`input[name="password"]`);
    await page.$eval(
      `input[name="password"]`,
      (el, value) => (el.value = value),
      PASSWORD
    );

    await page.click(`input[value="Login"]`);
    await page.waitForNavigation();

    await page.goto(REDIRECT);

    const containerText = await page.evaluate(
      () => document.getElementById("group-content").textContent
    );

    // console.log(containerText);

    if (global.currentBody != containerText && global.currentChatId !== -1) {
      global.currentBody = containerText;
      global.count += 1;
      await page.screenshot({ path: "example.png", fullPage: true });
      bot.sendPhoto(global.currentChatId, __dirname + "/example.png");
    }

    console.log("global count", global.count);
    console.log("New Page URL:", page.url());

    await browser.close();

    return containerText;
  })(process.env);
}, 1000 * 20);

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
    bot.sendPhoto(msg.chat.id, __dirname + "/example.png");
  }
});

module.exports = bot;
