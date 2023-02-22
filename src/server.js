//temp server
const express = require("express");
const app = express();
const port = 8008;

app.get("/tty", (req, res) => {
  res.sendFile("html/tty.html",{'root': './'});
});
app.get("/display", (req, res) => {
  res.sendFile("html/display.html",{'root': './'});
});
app.use("/src", express.static("src",{'root': './'}));
app.use("/badges", express.static("badges",{'root': './'}));
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
