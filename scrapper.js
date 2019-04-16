const puppeteer = require("puppeteer");
require("dotenv").config();

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
    /* await page.waitFor(`input[name="redirect"]`);
    await page.$eval(
      `input[name="redirect"]`,
      (el, value) => (el.value = value),
      REDIRECT
    ); */

    await page.click(`input[value="Login"]`);
    await page.waitForNavigation();

    await page.goto(REDIRECT);

    const containerText = await page.evaluate(
      () => document.getElementById("group-content").textContent
    );

    // console.log(containerText);

    if (global.currentBody !== containerText)
      console.log("global count", global.count);

    console.log("New Page URL:", page.url());

    global.currentBody = containerText;
    global.count += 1;

    await page.screenshot({ path: "example.png", fullPage: true });

    await browser.close();

    return containerText;
  })(process.env);
}, 1000 * 20);
