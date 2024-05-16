const express = require("express");
const bodyParser = require("body-parser");
var http = require("http");
const dotenv = require("dotenv").config();


const port = process.env.PORT;
const app = express();
app.use(express.json());


http.createServer(app).listen(port, function () {
  console.log("app listening on port " + port);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
  return;
});
app.use("/", require(`./routes`));
