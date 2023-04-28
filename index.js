const http = require("http");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const con = require("./database");
const adminController = require("./Controller/adminController");
const auth = require("./Controller/auth");

const app = express();

app.use(cors({ origin: true }));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

//GetAttributeById
app.get("/get-attributebyid/:id", async function (req, res) {
  const data = await adminController.getAttributeById(req.params);
  res.send({
    ...data,
  });
});

//CheckEmail
app.post("/check-email", async function (req, res) {
  const data = await adminController.checkEmail(req.body);
  res.send({
    ...data,
  });
});

//CheckMobile
app.post("/check-mobile", async function (req, res) {
  const data = await adminController.checkMobile(req.body);
  res.send({
    ...data,
  });
});

//Register
app.post("/register", async function (req, res) {
  const data = await adminController.registerUser(req.body);
  res.send({
    ...data,
  });
});

//Login
app.post("/login", async function (req, res) {
  const data = await auth.loginUser(req.body);
  res.send({
    ...data,
  });
});

//Insert Video
app.post("/register", async function (req, res) {
  const data = await adminController.insertVideo(req.body);
  res.send({
    ...data,
  });
});

const server = app.listen("8000", function () {
  console.log("Server Successfully Created");
});
