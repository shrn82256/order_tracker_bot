const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const packageInfo = require("./package.json");

const PORT = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "static")));

app.get("/", function(req, res) {
  res.json({ version: packageInfo.version });
});

var server = app.listen(PORT, "0.0.0.0", () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Web server started at http://%s:%s", host, port);
});

module.exports = bot => {
  app.post("/" + bot.token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};
