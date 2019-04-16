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
  let reply = "Welcome to telegram weather bot" + message;
  sendMessage(telegram_url, message, reply, res);
});
