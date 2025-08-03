const express = require("express");
const app = express();

const config = require("./config.json");

//== connect to database
const mongoURI = "mongodb://localhost:27017" + "/newsFeed";

let mongoose = require("mongoose");
const Leaderboard = require("./model");
const { link } = require("superagent");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to database"));

const onePageArticleCount = 20;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

app.get("/topRankings", async(req, res) => {
  // res.status(200).send("hello world!");

  const { limit = onePageArticleCount, offset = 0 } = req.query;
  console.log(limit,offset);
  const resData = await Leaderboard.find().skip(+offset).limit(+limit).lean();
  console.log(resData);
  res.status(200).json({ data: resData });
});

// ==end==

module.exports = { app, db };
