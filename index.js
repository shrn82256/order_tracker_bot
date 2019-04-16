var telegram = require("telegram-bot-api");

require("dotenv").config();

var api = new telegram({
  token: process.env.TELEGRAM_API_TOKEN
});

api
  .getMe()
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.log(err);
  });
