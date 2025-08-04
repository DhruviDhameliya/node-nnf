const con = require("../database");
const { mysql_real_escape_string } = require("./commonController");

var insertQuestion = async (data) => {
  try {
    let sql = `Insert into questions (question,v_id) values ('${mysql_real_escape_string(
      data.question
    )}',${data.v_id})`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.affectedRows > 0) {
            for (let i = 0; i < data.options.length; i++) {
              let sql1 = `Insert into options (name,ans,q_id) values ('${mysql_real_escape_string(
                data.options[i].name
              )}',${
                data.options[i].ans == undefined ||
                typeof data.options[i].ans == undefined
                  ? 0
                  : data.options[i].ans
              },${result.insertId})`;
              con.query(sql1, function (err1, result1) {
                if (err1) {
                  console.log(err1);
                  resolve({ status: 0, message: "Something went to wrong" });
                } else {
                  if (result1.affectedRows > 0) {
                    resolve({
                      status: 1,
                      message: "Option inserted Successfully...",
                    });
                  } else {
                    resolve({
                      status: 1,
                      message: "Option not inserted ...",
                    });
                  }
                }
              });
              if (data.options.length - 1 == i) {
                resolve({
                  status: 1,
                  message: "Question inserted Successfully...",
                });
              }
            }
          } else {
            resolve({
              status: 0,
              message: "Question not Inserted...",
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

var getQuestions = async (data) => {
  try {
    let sql = `SELECT questions.*,(row_number() over ( order by questions.q_id Asc) ) AS row_no,videos.v_name,o1.name as c_answer,(SELECT GROUP_CONCAT(options.name SEPARATOR ';') as name FROM options where options.q_id = questions.q_id and options.deleted =0)as option_name FROM questions left join videos on videos.v_id = questions.v_id left join options o1 on o1.q_id = questions.q_id and o1.ans = 1 WHERE videos.status = 0 and questions.status = 0 `;

    let paginateSql = `SELECT COUNT(questions.q_id) as trows FROM questions left join videos on videos.v_id = questions.v_id left join options o1 on o1.q_id = questions.q_id and o1.ans = 1  WHERE videos.status = 0 and questions.status = 0 `;

    if (typeof data.v_id != "undefined" && data.v_id != "" && data.v_id != 0) {
      sql += ` and questions.v_id = ${data.v_id}`;
      paginateSql += ` and questions.v_id = ${data.v_id}  Group by questions.q_id`;
    }
    sql += ` Group by questions.q_id order by questions.q_id Asc limit ${
      (parseInt(data.page) - 1) * parseInt(data.perPage)
    },${parseInt(data.perPage)}`;

    let resp = await new Promise((resolve, reject) => {
      con.query(paginateSql, function (err, res) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (res.length > 0) {
            resolve({
              status: 1,
              t_rows: res[0].trows,
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
              t_rows: resp.t_rows,
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

var updateQuestion = async (data) => {
  try {
    let sql = `Update questions set question = '${mysql_real_escape_string(
      data.question
    )}',v_id=${data.v_id} where q_id = ${data.q_id}`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.affectedRows > 0) {
            for (let i = 0; i < data.options.length; i++) {
              if (
                typeof data.options[i].o_id != undefined &&
                data.options[i].o_id != undefined
              ) {
                let sql1 = `update options set name = '${mysql_real_escape_string(
                  data.options[i].name
                )}',ans=${
                  data.options[i].ans == undefined ||
                  typeof data.options[i].ans == undefined
                    ? 0
                    : data.options[i].ans
                } where deleted = 0 and o_id=${data.options[i].o_id} and q_id=${
                  data.options[i].q_id
                }`;
                con.query(sql1, function (err1, result1) {
                  if (err1) {
                    console.log(err1);
                    resolve({ status: 0, message: "Something went to wrong" });
                  } else {
                    if (result1.affectedRows > 0) {
                      resolve({
                        status: 1,
                        message: "Option inserted Successfully...",
                      });
                    } else {
                      resolve({
                        status: 1,
                        message: "Option not inserted ...",
                      });
                    }
                  }
                });
              } else {
                let sql1 = `Insert into options (name,ans,q_id) values ('${mysql_real_escape_string(
                  data.options[i].name
                )}',${
                  data.options[i].ans == undefined ||
                  typeof data.options[i].ans == undefined
                    ? 0
                    : data.options[i].ans
                },${data.q_id})`;
                con.query(sql1, function (err1, result1) {
                  if (err1) {
                    console.log(err1);
                    resolve({ status: 0, message: "Something went to wrong" });
                  } else {
                    if (result1.affectedRows > 0) {
                      resolve({
                        status: 1,
                        message: "Option inserted Successfully...",
                      });
                    } else {
                      resolve({
                        status: 1,
                        message: "Option not inserted ...",
                      });
                    }
                  }
                });
              }

              if (data.options.length - 1 == i) {
                resolve({
                  status: 1,
                  message: "Question updated Successfully...",
                });
              }
            }
          } else {
            resolve({
              status: 0,
              message: "Question not Updated...",
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

var getOptionsById = async (data) => {
  try {
    let sql = `SELECT * from options where q_id = ${data.q_id} and deleted = 0`;
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
              message: "No Option Found",
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

var deleteOption = async (data) => {
  try {
    let sql = `Update options set deleted = 1 where o_id = ${data.o_id}`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.affectedRows > 0) {
            resolve({
              status: 1,
              message: "Option deleted Successf ully...",
            });
          } else {
            resolve({
              status: 0,
              message: "Option not deleted...",
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

var getOptionsForQuizById = async (data) => {
  try {
    let sql = `SELECT o_id,name,q_id from options where q_id = ${data.q_id} and deleted = 0`;
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
              message: "No Option Found",
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
  insertQuestion,
  getQuestions,
  updateQuestion,
  getOptionsById,
  deleteOption,
  getOptionsForQuizById,
};
