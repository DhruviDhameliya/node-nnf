const con = require("../database");
var md5 = require("md5");
const nodeMailer = require("nodemailer");
const paths = require("path");
var fs = require("fs");

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
      let sql = `INSERT INTO users (name,age,gender,marital_status,no_of_children,address,city,pincode,mobile,u_email,qualification,specialty,other_specialty,type_of_work,member_of,year_of_exp,name_of_organization,kmc,kmc_years,kmc_to_children,kmc_work_area,password,area_of_work,other_area_of_work,exact_area_of_work,other_exact_area_of_work) VALUES ('${data.name
        }',${data.age},${data.gender},${data.marital_status},${data.no_of_children
        },'${mysql_real_escape_string(data.address)}','${mysql_real_escape_string(
          data.city
        )}','${data.pincode}','${data.mobile}','${data.u_email
        }','${mysql_real_escape_string(data.qualification)}',${data.specialty},'${data.specialty == 0
          ? mysql_real_escape_string(data.other_specialty)
          : ""
        }',${data.type_of_work},${data.member_of},${data.year_of_exp
        },'${mysql_real_escape_string(data.name_of_organization)}',${data.kmc},${data.kmc_work_area == 1 ? data.kmc_years : 0
        },${data.kmc_to_children},${data.kmc_work_area},'${md5(data.password)}',${data.area_of_work
        },'${data.area_of_work == 0
          ? mysql_real_escape_string(data.other_area_of_work)
          : ""
        }',${data.exact_area_of_work},'${data.exact_area_of_work == 0
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

var updateUser = async (data) => {
  try {
    let sql = `Update users set name='${data.name}',age=${data.age
      },marital_status=${data.marital_status},no_of_children=${data.no_of_children
      },address='${mysql_real_escape_string(
        data.address
      )}',city='${mysql_real_escape_string(data.city)}',pincode='${data.pincode
      }',gender=${data.gender},qualification='${mysql_real_escape_string(
        data.qualification
      )}',specialty=${data.specialty},other_specialty='${data.specialty == 0 ? mysql_real_escape_string(data.other_specialty) : ""
      }',type_of_work=${data.type_of_work},member_of=${data.member_of
      },year_of_exp=${data.year_of_exp
      },name_of_organization='${mysql_real_escape_string(
        data.name_of_organization
      )}',kmc=${data.kmc},kmc_work_area=${data.kmc_work_area},kmc_years= ${data.kmc_work_area == 1 ? data.kmc_years : 0
      },kmc_to_children=${data.kmc_to_children},area_of_work=${data.area_of_work
      },other_area_of_work='${data.area_of_work == 0
        ? mysql_real_escape_string(data.other_area_of_work)
        : ""
      }',exact_area_of_work=${data.exact_area_of_work
      },other_exact_area_of_work='${data.exact_area_of_work == 0
        ? mysql_real_escape_string(data.other_exact_area_of_work)
        : ""
      }' Where u_id = ${data.u_id}`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.affectedRows > 0) {
            resolve({
              status: 1,
              message: "User Updated Successfully...",
            });
          } else {
            resolve({
              status: 0,
              message: "User not Updated...",
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

var updatePassword = async (data) => {
  try {
    let checkPassword = `Select u_id from users where u_id=${data.u_id
      } and password='${md5(data.o_password)}'`;
    let response = await new Promise((resolve, reject) => {
      con.query(checkPassword, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            let sql = `Update users set password='${md5(
              data.n_password
            )}' Where u_id = ${data.u_id}`;

            con.query(sql, function (err1, result1) {
              if (err1) {
                console.log(err1);
                resolve({ status: 0, message: "Something went to wrong" });
              } else {
                if (result1.affectedRows > 0) {
                  resolve({
                    status: 1,
                    message: "User Password Updated Successfully...",
                  });
                } else {
                  resolve({
                    status: 0,
                    message: "User not Updated...",
                  });
                }
              }
            });
            resolve({
              status: 1,
              message: "User Password Updated Successfully...",
            });
          } else {
            resolve({
              status: 0,
              message: "Old Password is Wrong...",
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

var getAllUsers = async (data) => {
  try {
    let sql = `SELECT users.*,certificates.created_timestamp as certificateDate,a1.name as specialty_name,a2.name as type_of_work,a3.name as member_of,a4.name as area_of_work,a5.name as exact_area_of_work FROM users left join attributes a1 on a1.attribute_id = users.specialty left join attributes a2 on a2.attribute_id = users.type_of_work left join attributes a3 on a3.attribute_id = users.member_of left join attributes a4 on a4.attribute_id = users.area_of_work left join attributes a5 on a5.attribute_id = users.exact_area_of_work  left join certificates on certificates.u_id = users.u_id where users.type=1 `;
    let sqlPaginate = `SELECT COUNT(users.u_id) as total FROM users where users.type=1 `;
    if (
      typeof data.search != "undefined" &&
      data.search != "" &&
      data.search != 0
    ) {
      sql += ` and (users.name like '%${data.search}%' OR users.u_email like '%${data.search}%' OR users.mobile like '%${data.search}%')`;
      sqlPaginate += ` and (users.name like '%${data.search}%' OR users.u_email like '%${data.search}%' OR users.mobile like '%${data.search}%')`;
    }
    if (
      typeof data.type != "undefined" &&
      data.type != "" &&
      data.type != 0
    ) {
      sql += ` and users.certificate_status = ${data.type == 2 ? 0 : 1} `;
      sqlPaginate += ` and users.certificate_status = ${data.type == 2 ? 0 : 1} `;
    }
    sql += ` order by users.u_id Desc limit ${(parseInt(data.page) - 1) * parseInt(data.perPage)
    },${parseInt(data.perPage)} `;
    
    let resp = await new Promise((resolve, reject) => {
      con.query(sqlPaginate, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            resolve({
              status: 1,
              total_user: result[0].total,
            });
          } else {
            resolve({
              status: 0,
              total_user: 0,
            });
          }
        }
      });
    });
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
              total_users: resp.total_user,
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

var getMonthWiseUsers = async () => {
  try {
    let sql = `select date(created_timestamp), count(*) from users
    where MONTH(created_timestamp) = MONTH(now())
    and YEAR(created_timestamp) = YEAR(now()) and type = 1
    group by date(created_timestamp);`;
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

var updateCertificateStatus = async (data) => {
  try {
    let certi_no = 0;
    let getlastCerti = `select * from certificates order by certificate_id DESC limit 1`;
    let resp = await new Promise((resolve, reject) => {
      con.query(getlastCerti, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            let cno = result[0].certi_name;
            let n_cno = cno.slice(7);
            certi_no = "NNFG100" + `${++n_cno}`;
            resolve({
              status: 0,
              certiNo: certi_no,
            });
          } else {
            certi_no = "NNFG100" + 1;
            resolve({
              status: 0,
              certiNo: certi_no,
            });
          }
        }
      });
    });

    let sql = `Update users set certificate_status=1 Where u_id = ${data.u_id}`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.affectedRows > 0) {
            let insertCerti = `insert into certificates (certi_name,u_id) VALUES ('${resp.certiNo}',${data.u_id})`;
            con.query(insertCerti, function (err1, result1) {
              if (err1) {
                console.log(err1);
                resolve({ status: 0, message: "Something went to wrong" });
              } else {
                if (result1.affectedRows > 0) {
                  resolve({
                    status: 1,
                    message: "User Certificate status Updated Successfully...",
                  });
                } else {
                  resolve({
                    status: 0,
                    message: " User Certificate status  not Updated...",
                  });
                }
              }
            });
            resolve({
              status: 1,
              message: "User Certificate status Updated Successfully...",
            });
          } else {
            resolve({
              status: 0,
              message: " User Certificate status  not Updated...",
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

var getUserDataById = async (data) => {
  try {
    let sql = `SELECT users.*,certificates.certi_name as certificate_name,certificates.created_timestamp FROM users left join certificates on certificates.u_id =users.u_id and users.certificate_status = 1 Where users.type=1 and users.u_id = ${data.u_id}`;
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

var getEmailSetting = async () => {
  try {
    let sql = `SELECT * from gsetting`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            resolve({
              status: 1,
              data: result[0],
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
async function sendOtp(data) {
  try {
    let sql = `SELECT * FROM users WHERE u_email='${data.u_email}'`;
    let senderMailSetting = await getEmailSetting();
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            let otpCode = Math.floor(Math.random() * 1000000) + 1;
            const sql1 = `UPDATE users SET token=${otpCode}  WHERE u_email='${data.u_email}'`;
            con.query(sql1, (err, result1) => {
              if (err) {
                resolve({ status: 0, message: "Something went to wrong" });
              }
              if (result1.affectedRows > 0) {
                let newpath = paths.join(
                  __dirname,
                  "../resetPasswordLink.html"
                );
                let transporter = nodeMailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: "nnfgujaratsecretary@gmail.com",
                    pass: "afpobjhlnwjrqaaj",
                  },
                });
                fs.readFile(
                  newpath,
                  { encoding: "utf-8" },
                  function (err, html) {
                    let htmlFile = html;
                    htmlFile = htmlFile.replace(
                      "{{link}}",
                      `http://165.232.185.216/reset-password/${otpCode}`
                    );
                    if (err) {
                      console.log(err);
                    } else {
                      var mailOptions = {
                        from: "harshpatel.9908@gmail.com",
                        to: data.u_email,
                        subject: "Forgot Password",
                        html: htmlFile,
                      };

                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log(
                            "Message %s sent: %s",
                            info.messageId,
                            info.response
                          );
                          resolve({
                            status: 1,
                            message: "OTP sent Successfully",
                          });
                        }
                      });
                    }
                  }
                );

                // let mailOptions = {
                //   from: "harshpatel.9908@gmail.com",
                //   to: data.u_email,
                //   subject: "One Time Password",
                //   text: `http://192.168.1.59:3000/reset-password/${otpCode}`,
                // };
                // transporter.sendMail(mailOptions, (err, info) => {
                //   if (err) {
                //     return console.log(err);
                //   } else {
                //     console.log(
                //       "Message %s sent: %s",
                //       info.messageId,
                //       info.response
                //     );
                //   }

                //   // res.render("index");
                // });
                // resolve({
                //   status: 1,
                //   message: "OTP sent Successfully",
                // });
              } else {
                resolve({
                  status: 0,
                  message: "Something went to wrong",
                });
              }
            });
          } else {
            resolve({ status: 0, message: "Email doesn't exist....." });
          }
        }
      });
    });
    return response;
  } catch (error) {
    console.log(error);
    return { status: 0, message: "Invalid Call Try Again" };
  }
}

async function setNewPassword(data) {
  try {
    let sql = `UPDATE users SET password='${md5(
      data.n_password
    )}',token=${null} WHERE token=${data.otp}`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);

          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.affectedRows > 0) {
            resolve({
              status: 1,
              message: "Password updated Successfully",
            });
          } else {
            resolve({
              status: 0,
              message: "Password not Updated",
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
}

var getExcelUser = async (data) => {
  try {
    let totalResult = `SELECT users.*,certificates.created_timestamp as certificateDate,a1.name as specialty_name,a2.name as type_of_work,a3.name as member_of,a4.name as area_of_work,a5.name as exact_area_of_work FROM users left join attributes a1 on a1.attribute_id = users.specialty left join attributes a2 on a2.attribute_id = users.type_of_work left join attributes a3 on a3.attribute_id = users.member_of left join attributes a4 on a4.attribute_id = users.area_of_work left join attributes a5 on a5.attribute_id = users.exact_area_of_work  left join certificates on certificates.u_id = users.u_id where users.type=1 `;
    if (
      typeof data.search != "undefined" &&
      data.search != "" &&
      data.search != 0
    ) {
      totalResult += ` and (users.name like '%${data.search}%' OR users.u_email like '%${data.search}%' OR users.mobile like '%${data.search}%')`;
    }
    if (
      typeof data.type != "undefined" &&
      data.type != "" &&
      data.type != 0
    ) {
      totalResult += ` and users.certificate_status = ${data.type == 2 ? 0 : 1} `;
    }
    if (
      typeof data.u_name != "undefined" &&
      data.u_name != "" &&
      data.u_name != 0
    ) {
      totalResult += ` and (users.name like '%${data.u_name}%' OR videos.v_name like '%${data.u_name}%' )`;
    }
    totalResult += ` Order by users.u_id ASC`;
    console.log(totalResult,"totalResult");
    let response = await new Promise((resolve, reject) => {
      con.query(totalResult, function (err, result) {
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
  mysql_real_escape_string,
  getAttributeById,
  registerUser,
  checkEmail,
  checkMobile,
  updateUser,
  getAllUsers,
  updatePassword,
  getMonthWiseUsers,
  updateCertificateStatus,
  getUserDataById,
  sendOtp,
  setNewPassword,
  getExcelUser
};
