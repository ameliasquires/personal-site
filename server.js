//temp server
const express = require("express");
const app = express();
const port = 8008;

app.get("/tty", (req, res) => {
  res.sendFile(__dirname + "/tty.html");
});
app.get("/display", (req, res) => {
  res.sendFile(__dirname + "/display.html");
});
app.use("/src", express.static("src"));
app.listen(port, () => {
  console.log(`${port}`);
});
