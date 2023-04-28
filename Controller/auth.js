const con = require("../database");
var md5 = require("md5");

async function loginUser(data) {
  try {
    let sql = `SELECT * FROM users WHERE (u_email = '${
      data.u_email
    }' AND password = '${md5(data.password)}') OR (mobile = '${
      data.u_email
    }' AND password = '${md5(data.password)}')`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length == 0) {
            test = {
              message: "Invalid Email id OR Mobile Number and Password  ",
              status: 0,
              data: [],
            };
            resolve(test);
          }
          if (result.length > 0) {
            test = {
              message: "Login Successfully",
              status: 1,
              data: result[0],
            };
            resolve(test);
          } else {
            resolve({
              status: 0,
              message: "Login not Logged in...",
            });
          }
        }
      });
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { loginUser };
