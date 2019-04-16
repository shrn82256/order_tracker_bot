var express = require("express");
var bodyParser = require("body-parser");
const axios = require("axios");

require("dotenv").config();

var app = express();

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

let telegram_url =
  "https://api.telegram.org/bot" +
  process.env.TELEGRAM_API_TOKEN +
  "/sendMessage";

function sendMessage(url, message, reply, res) {
  axios
    .post(url, { chat_id: message.chat.id, text: reply })
    .then(response => {
      console.log("Message posted");
      res.end("ok");
    })
    .catch(error => {
      console.log(error);
    });
}

app.post("/start_bot", function(req, res) {
  const { message } = req.body;
  if ("text" in message) {
    var reply = `${message.text} to you too`;
  } else {
    var reply = "kuch dhang ka likh be";
    console.log(message);
  }

  sendMessage(telegram_url, message, reply, res);
});

app.get("/test", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT, () =>
  console.log("Telegram bot is listening on port 3000!")
);
