const http = require("http");
const https = require("https");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const con = require("./database");
const commonController = require("./Controller/commonController");
const questionController = require("./Controller/questionController");
const videoController = require("./Controller/videoController");
const quizController = require("./Controller/quizController");
const courseController = require("./Controller/courseController");

const auth = require("./Controller/auth");
const moment = require("moment");

const app = express();

app.use(cors({ origin: true }));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(function (req, res, next) {
  con.query(
    `SET GLOBAL sql_mode = 'NO_ENGINE_SUBSTITUTION'`,
    function (err, result) {
      if (err) {
      }
      if (result) {
        // req.setHeader("Content-Type", "application/json; charset=utf-8");
        // console.log('reset settingdata');
        console.log(result);
      }
    }
  );
  console.log(req.url);
  console.log(moment().format("DD-MM-YYYY hh:mm:ss a"));
  console.log("********REQ Params********", req.params);
  console.log("********Req BODY********", req.body);
  next();
});
//Common
app.use('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});

//Get AttributeById
app.get("/get-attributebyid/:id", async function (req, res) {
  const data = await commonController.getAttributeById(req.params);
  res.send({
    ...data,
  });
});

//Get Users
app.post("/get-users", async function (req, res) {
  const data = await commonController.getAllUsers(req.body);
  res.send({
    ...data,
  });
});

//Check Email
app.post("/check-email", async function (req, res) {
  const data = await commonController.checkEmail(req.body);
  res.send({
    ...data,
  });
});

//Check Mobile
app.post("/check-mobile", async function (req, res) {
  const data = await commonController.checkMobile(req.body);
  res.send({
    ...data,
  });
});

//Register
app.post("/register", async function (req, res) {
  const data = await commonController.registerUser(req.body);
  res.send({
    ...data,
  });
});

//Update Profile
app.post("/update-profile", async function (req, res) {
  const data = await commonController.updateUser(req.body);
  res.send({
    ...data,
  });
});

//Update Password
app.post("/update-password", async function (req, res) {
  const data = await commonController.updatePassword(req.body);
  res.send({
    ...data,
  });
});

//Get Moth wise Total Users
app.get("/get-monthwiseusers", async function (req, res) {
  const data = await commonController.getMonthWiseUsers();
  res.send({
    ...data,
  });
});

//Update Certificate Status
app.get("/update-certificatestatus/:u_id", async function (req, res) {
  const data = await commonController.updateCertificateStatus(req.params);
  res.send({
    ...data,
  });
});

//Get users by id
app.get("/get-userbyid/:u_id", async function (req, res) {
  const data = await commonController.getUserDataById(req.params);
  res.send({
    ...data,
  });
});

//Send Otp for forgot password
app.post("/send-otp", async function (req, res) {
  const data = await commonController.sendOtp(req.body);
  res.send({
    ...data,
  });
});

//Send Otp for forgot password
app.post("/update-newpassword", async function (req, res) {
  const data = await commonController.setNewPassword(req.body);
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

//Admin Controller

//Insert Video
app.post("/insert-video", async function (req, res) {
  const data = await videoController.insertVideo(req.body);
  res.send({
    ...data,
  });
});

//Get Videos
app.get("/get-videos", async function (req, res) {
  const data = await videoController.getVideos();
  res.send({
    ...data,
  });
});

//Update Video
app.post("/update-video", async function (req, res) {
  const data = await videoController.updateVideo(req.body);
  res.send({
    ...data,
  });
});

//Insert Question
app.post("/insert-question", async function (req, res) {
  const data = await questionController.insertQuestion(req.body);
  res.send({
    ...data,
  });
});

//Get Questions
app.post("/get-questions", async function (req, res) {
  const data = await questionController.getQuestions(req.body);
  res.send({
    ...data,
  });
});

//Get Options
app.get("/get-option/:q_id", async function (req, res) {
  const data = await questionController.getOptionsById(req.params);
  res.send({
    ...data,
  });
});

//Update Question
app.post("/update-question", async function (req, res) {
  const data = await questionController.updateQuestion(req.body);
  res.send({
    ...data,
  });
});

//Delete options
app.get("/delete-option/:o_id", async function (req, res) {
  const data = await questionController.deleteOption(req.params);
  res.send({
    ...data,
  });
});

//Get option for Quiz
app.get("/get-optionforquiz/:q_id", async function (req, res) {
  const data = await questionController.getOptionsForQuizById(req.params);
  res.send({
    ...data,
  });
});

//Insert Course
app.post("/insert-course", async function (req, res) {
  const data = await courseController.insertCourse(req.body);
  res.send({
    ...data,
  });
});

//Update Course
app.post("/update-course", async function (req, res) {
  const data = await courseController.updateCourse(req.body);
  res.send({
    ...data,
  });
});

//Get Course
app.get("/get-course", async function (req, res) {
  const data = await courseController.getCourses();
  res.send({
    ...data,
  });
});

//Get Videos by course Id For Admin
app.get("/get-videobycourse/:c_id", async function (req, res) {
  const data = await videoController.getVideosByCourse(req.params);
  res.send({
    ...data,
  });
});

//User Controller

//get videos with percentage
app.get("/get-videoswithpercentage/:u_id/:c_id", async function (req, res) {
  const data = await quizController.getVideosWithPercentage(req.params);
  res.send({
    ...data,
  });
});

//update or insert video percentage
app.post("/update-videopercentage", async function (req, res) {
  const data = await quizController.updateVideoPercentage(req.body);
  res.send({
    ...data,
  });
});

//Get question for Quiz
app.get("/get-questionforquiz/:v_id", async function (req, res) {
  const data = await quizController.getQuestionsForQuiz(req.params);
  res.send({
    ...data,
  });
});

//Insert Quiz
app.post("/insert-quiz", async function (req, res) {
  const data = await quizController.insertQuiz(req.body);
  res.send({
    ...data,
  });
});

//Get option for Quiz
app.get("/get-quizresult/:u_id/:v_id/:quiz_type", async function (req, res) {
  const data = await quizController.getQuizResult(req.params);
  res.send({
    ...data,
  });
});

//Get videos by Course
// app.post("/get-quizreport", async function (req, res) {
//   const data = await quizController.getQuizReport(req.body);
//   res.send({
//     ...data,
//   });
// });

//Get videos by Course
app.post("/get-quizreportbyuser", async function (req, res) {
  const data = await quizController.getQuizReportOfUser(req.body);
  res.send({
    ...data,
  });
});

//Get videos by Course
app.post("/get-quizexcelreport", async function (req, res) {
  const data = await quizController.getExcelQuizReport(req.body);
  res.send({
    ...data,
  });
});

//get Course With Video Data
app.get("/get-coursewithvideodata/:u_id", async function (req, res) {
  const data = await quizController.getCourseWithVideoData(req.params);
  res.send({
    ...data,
  });
});

app.post("/get-quizuserlist", async function (req, res) {
  const data = await quizController.getQuizUser(req.body);
  res.send({
    ...data,
  });
});

app.get("/get-alluserreport/:type", async function (req, res) {
  const data = await quizController.downloadAllUserReport(req.params);
  res.send({
    ...data,
  });
});

app.get("/fetch-quizReportExcel/:id",async function (req, res) {
  const data = req.params;
  console.log(`${__dirname}/public/Assets/UserReports/user_${data.id}_quiz_data.xlsx`,"data.id");
  res.sendFile(`${__dirname}/public/Assets/UserReports/user_${data.id}_quiz_data.xlsx`);
});

app.get("/fetch-allQuizReportExcel/:type",async function (req, res) {
  const data = req.params;
  console.log(data,"data");
  res.sendFile(`${__dirname}/public/Assets/UserReports/User_${data.type == 0 ? 'Pre' : "Post"}_Quiz_Report.xlsx`);
});

app.post("/get-excelusers", async function (req, res) {
  const data = await commonController.getExcelUser(req.body);
  res.send({
    ...data,
  });
});

// const options = {
//   cert: fs.readFileSync(
//     "../../../../etc/letsencrypt/live/165.232.185.216/fullchain.pem"
//   ),
//   key: fs.readFileSync(
//     "../../../../etc/letsencrypt/live/165.232.185.216/privkey.pem"
//   ),
// };
const server = app.listen("8005", function () {
  console.log("Server Successfully Created");
});
// const server = https.createServer(options, app).listen(8005);
