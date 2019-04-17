const rp = require("request-promise");
const cheerio = require("cheerio");

const AWB = process.env.AWB;

module.exports = rp({
  method: "POST",
  uri: "https://www.bdtracking.in/blueDart/blueDartWork.php",
  form: {
    traceStatusFormSubmit: "traceStatusFormSubmit",
    awb: "awb",
    numbers: AWB
  }
}).then(body => {
  const $ = cheerio.load(body);
  const data = $(`tr[bgcolor="WHITE"]:nth-child(4) td`)
    .map((i, el) =>
      $(el)
        .text()
        .trim()
    )
    .get();

  return `*${AWB}*\n${data[0]}\n${data[1]}\n${data[3]} ${data[2]}`;
});
