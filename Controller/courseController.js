const con = require("../database");
const { mysql_real_escape_string } = require("./commonController");
const { getVideosWithPercentage } = require("./videoController");

var insertCourse = async (data) => {
  try {
    let checkCourse = `Select course_name from course where course_name='${mysql_real_escape_string(
      data.course_name
    )}'`;
    let response = await new Promise((resolve, reject) => {
      con.query(checkCourse, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length == 0) {
            let sql = `insert into course (course_name) values ('${mysql_real_escape_string(
              data.course_name
            )}')`;
            con.query(sql, function (err1, result1) {
              if (err1) {
                console.log(err1);
                resolve({ status: 0, message: "Something went to wrong" });
              } else {
                if (result1.affectedRows > 0) {
                  resolve({
                    status: 1,
                    message: "Course inserted Successfully...",
                  });
                } else {
                  resolve({
                    status: 0,
                    message: "Course not Inserted...",
                  });
                }
              }
            });
            resolve({
              status: 1,
              message: "Course inserted Successfully...",
            });
          } else {
            resolve({
              status: 0,
              message: "Course is already Exists...",
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

var updateCourse = async (data) => {
  try {
    let sql = `update course set course_name='${mysql_real_escape_string(
      data.course_name
    )}' where c_id = ${data.c_id}`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.affectedRows > 0) {
            resolve({
              status: 1,
              message: "Course Updated Successfully...",
            });
          } else {
            resolve({
              status: 0,
              message: "Course not Updated...",
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

var getCourses = async () => {
  try {
    let sql = `SELECT *,(row_number() over ( order by course.c_id Asc) ) AS row_no FROM course`;
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
  insertCourse,
  updateCourse,
  getCourses,
};
