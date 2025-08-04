const con = require("../database");
const { mysql_real_escape_string } = require("./commonController");

var insertVideo = async (data) => {
  try {
    let sql = `insert into videos (v_name,v_link,v_duration,v_img,c_id) values ('${mysql_real_escape_string(
      data.v_name
    )}','${mysql_real_escape_string(data.v_link)}','${
      data.v_duration
    }','${mysql_real_escape_string(data.v_img)}',${data.c_id})`;
    // let sql = `insert into videos (v_name,v_link,v_duration,v_img) values ('${mysql_real_escape_string(
    //   data.v_name
    // )}','${mysql_real_escape_string(data.v_link)}','${
    //   data.v_duration
    // }','${mysql_real_escape_string(data.v_img)}')`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.affectedRows > 0) {
            resolve({
              status: 1,
              message: "Video inserted Successfully...",
            });
          } else {
            resolve({
              status: 0,
              message: "Video not Inserted...",
            });
          }
        }
      });
    });
    return response;
  } catch (error) {
    console.log(error);
    return { status: 0, message: "Invalid Call Try Again" };
  }
};

var getVideos = async () => {
  try {
    let sql = `SELECT videos.*,(row_number() over ( order by videos.v_id Asc) ) AS row_no,course.course_name FROM videos left join course on course.c_id = videos.c_id WHERE status = 0`;
    // let sql = `SELECT videos.*,(row_number() over ( order by videos.v_id Asc) ) AS row_no FROM videos WHERE status = 0`;

    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            resolve({
              status: 1,
              data: result,
            });
          } else {
            resolve({
              status: 0,
              data: [],
              message: "No Data Found",
            });
          }
        }
      });
    });
    return response;
  } catch (error) {
    console.log(error);
    return { status: 0, message: "Invalid Call Try Again" };
  }
};

var updateVideo = async (data) => {
  try {
    let sql = `update videos set v_name = '${mysql_real_escape_string(
      data.v_name
    )}',v_link='${mysql_real_escape_string(data.v_link)}',v_duration='${
      data.v_duration
    }',v_img='${mysql_real_escape_string(data.v_img)}',c_id=${
      data.c_id
    } where v_id = ${data.v_id}`;
    // let sql = `update videos set v_name = '${mysql_real_escape_string(
    //   data.v_name
    // )}',v_link='${mysql_real_escape_string(data.v_link)}',v_duration='${
    //   data.v_duration
    // }',v_img='${mysql_real_escape_string(data.v_img)}' where v_id = ${
    //   data.v_id
    // }`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.affectedRows > 0) {
            resolve({
              status: 1,
              message: "Video updated Successfully...",
            });
          } else {
            resolve({
              status: 0,
              message: "Video not Updated...",
            });
          }
        }
      });
    });
    return response;
  } catch (error) {
    console.log(error);
    return { status: 0, message: "Invalid Call Try Again" };
  }
};

var getVideosByCourse = async (data) => {
  try {
    let sql = `SELECT videos.*,course.course_name FROM videos left join course on course.c_id = videos.c_id WHERE  videos.status = 0 and videos.c_id =${data.c_id}`;

    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            resolve({
              status: 1,
              data: result,
            });
          } else {
            resolve({
              status: 0,
              data: [],
              message: "No Data Found",
            });
          }
        }
      });
    });
    return response;
  } catch (error) {
    console.log(error);
    return { status: 0, message: "Invalid Call Try Again" };
  }
};

module.exports = {
  insertVideo,
  getVideos,
  updateVideo,
  getVideosByCourse,
};
