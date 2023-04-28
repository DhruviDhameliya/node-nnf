const con = require("../database");
var md5 = require("md5");

function mysql_real_escape_string(str) {
  if (str != undefined && str != "" && str != null) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
        case "\0":
          return "\\0";
        case "\x08":
          return "\\b";
        case "\x09":
          return "\\t";
        case "\x1a":
          return "\\z";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case '"':
        case "'":
        case "\\":
          return "\\" + char;
        case "%":
          return char;
      }
    });
  }
  return str;
}

var getAttributeById = async (data) => {
  try {
    let sql = `SELECT * FROM attributes WHERE type=${data.id} order by attribute_id ASC `;
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

var checkEmail = async (data) => {
  try {
    let sql = `SELECT * FROM users WHERE u_email = '${data.u_email}'`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            resolve({ status: 0, message: "Email already Exists..." });
          } else {
            resolve({ status: 1, message: "Email not Exists..." });
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

var checkMobile = async (data) => {
  try {
    let sql = `SELECT * FROM users WHERE mobile = '${data.mobile}'`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            resolve({ status: 0, message: "Mobile Number already Exists..." });
          } else {
            resolve({ status: 1, message: "Mobile Number not Exists..." });
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

var registerUser = async (data) => {
  try {
    const checkUser = await checkEmail({ u_email: data.u_email });
    const checkPhone = await checkMobile({ mobile: data.mobile });
    if (checkUser.status == 1 && checkPhone.status == 1) {
      let sql = `INSERT INTO users (u_name,gender,marital_status,no_of_children,address,city,pincode,mobile,u_email,qualification,specialty,other_specialty,type_of_work,member_of,year_of_exp,name_of_organization,kmc,kmc_years,kmc_to_children,kmc_work_area,password,area_of_work,other_area_of_work,exact_area_of_work,other_exact_area_of_work) VALUES ('${
        data.name
      }',${data.gender},${data.marital_status},${
        data.no_of_children
      },'${mysql_real_escape_string(data.address)}','${mysql_real_escape_string(
        data.city
      )}','${mysql_real_escape_string(data.pincode)}','${data.mobile}','${
        data.u_email
      }','${mysql_real_escape_string(data.qualification)}',${data.specialty},'${
        data.specialty == 0
          ? mysql_real_escape_string(data.other_specialty)
          : ""
      }',${data.type_of_work},${data.member_of},${
        data.year_of_exp
      },'${mysql_real_escape_string(data.name_of_organization)}',${data.kmc},${
        data.kmc_work_area == 1 ? data.kmc_years : 0
      },${data.kmc_to_children},${data.kmc_work_area},'${md5(data.password)}',${
        data.area_of_work
      },'${
        data.area_of_work == 0
          ? mysql_real_escape_string(data.other_area_of_work)
          : ""
      }',${data.exact_area_of_work},'${
        data.exact_area_of_work == 0
          ? mysql_real_escape_string(data.other_exact_area_of_work)
          : ""
      }')`;
      let response = await new Promise((resolve, reject) => {
        con.query(sql, function (err, result) {
          if (err) {
            console.log(err);
            resolve({ status: 0, message: "Something went to wrong" });
          } else {
            if (result.affectedRows > 0) {
              resolve({
                status: 1,
                message: "User Registered Successfully...",
              });
            } else {
              resolve({
                status: 0,
                message: "User not Registered...",
              });
            }
          }
        });
      });
      return response;
    } else {
      if (checkPhone.status == 0) {
        return { status: 0, message: "Mobile already Exists..." };
      } else {
        return { status: 0, message: "Email already Exists..." };
      }
    }
  } catch (error) {
    console.log(error);
    return { status: 0, message: "Invalid Call Try Again" };
  }
};

var insertVideo = async (data) => {
  try {
    let sql = `insert into videos (v_description,v_link) values ('${mysql_real_escape_string(
      data.v_description
    )}','${mysql_real_escape_string(data.v_link)}')`;
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

module.exports = {
  getAttributeById,
  registerUser,
  checkEmail,
  checkMobile,
  insertVideo,
};
