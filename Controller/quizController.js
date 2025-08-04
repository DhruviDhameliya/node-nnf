const con = require("../database");
const ExcelJS = require('exceljs');
const path = require("path");
const fs = require("fs");
const moment = require("moment");

// var insertQuiz = async (data) => {
//   try {
//     let response = await new Promise(async (resolve, reject) => {
//       let total_correct_ans = 0;
//       let total_wrong_ans = 0;
//       for (let i = 0; i < data.ansList.length; i++) {
//         let getOption = `Select o_id from options where q_id = ${data.ansList[i].question_id} and ans = 1 and deleted = 0`;
//         let resp = await new Promise(async (resolve, reject) => {
//           con.query(getOption, function (err1, result1) {
//             if (err1) {
//               console.log(err1);
//               resolve({ status: 0, message: "Something went to wrong" });
//             } else {
//               if (result1.length > 0) {
//                 let sql = `Insert into quiz (u_id,quiz_type,v_id,q_id,ans_id,correct_ans,attempt) values (${data.u_id},${data.quiz_type},${data.v_id},${data.ansList[i].question_id},${data.ansList[i].answer},${result1[0].o_id},${data.attempt})`;
//                 con.query(sql, function (err, result) {
//                   if (err) {
//                     console.log(err);
//                     resolve({ status: 0, message: "Something went to wrong" });
//                   } else {
//                     if (result.affectedRows > 0) {
//                       if (data.ansList[i].answer == result1[0].o_id) {
//                         total_correct_ans = total_correct_ans + 1;
//                       } else {
//                         total_wrong_ans = total_wrong_ans + 1;
//                       }
//                       resolve({
//                         status: 1,
//                         message: "Quiz Submitted Successfully...",
//                       });
//                     } else {
//                       resolve({
//                         status: 1,
//                         message: "Quiz not Submitted...",
//                       });
//                     }
//                   }
//                 });
//               } else {
//                 resolve({
//                   status: 1,
//                   message: "Quiz not Submitted...",
//                 });
//               }
//             }
//           });
//         });

//         if (data.ansList.length - 1 == i) {
//           resolve({
//             status: 1,
//             message: "Quiz Submitted Successfully...",
//           });
//         }
//       }
//       let getPreQuiz = `Select q_r_id from quiz_result where u_id = ${data.u_id} AND v_id = ${data.v_id} AND quiz_type = 0`;
//       let getPreQuizResp = await new Promise(async (resolve, reject) => {
//         con.query(getPreQuiz, function (getPreQuiz_err, getPreQuiz_result) {
//           if (getPreQuiz_err) {
//             console.log(getPreQuiz_err);
//             resolve({ status: 0, message: "Something went to wrong" });
//           } else {
//             console.log(getPreQuiz_result,"getPreQuiz_result");
//             if (getPreQuiz_result.length > 0) {
//               resolve({
//                 status: 0,
//                 data: getPreQuiz_result.length,
//               });
//             } else {
//               resolve({
//                 status: 1,
//                 data : 0
//               });
//             }
//           }
//         });
//       });
//       if((getPreQuizResp.data == 0 && getPreQuizResp.status == 1) || data.quiz_type == 1){
//         let insertResult = `Insert into quiz_result (u_id,v_id,attempt,quiz_type,total_question,total_correct_ans,total_wrong_ans) VALUES (${data.u_id},${data.v_id},${data.attempt},${data.quiz_type},${data.total_question},${total_correct_ans},${total_wrong_ans})`;
//         let resp1 = await new Promise(async (resolve, reject) => {
//           con.query(insertResult, function (err2, result2) {
//             if (err2) {
//               console.log(err2);
//               resolve({ status: 0, message: "Something went to wrong" });
//             } else {
//               if (result2.affectedRows > 0) {
//                 resolve({
//                   status: 1,
//                   message: "Result inserted Successfully...",
//                 });
//               } else {
//                 resolve({
//                   status: 1,
//                   message: "Result not  inserted ...",
//                 });
//               }
//             }
//           });
//         });
//       }else{
//         resolve({
//           status: 1,
//           message: "Result inserted Successfully...",
//         });
//       }
//     });

//     return response;
//   } catch (error) {
//     console.log(error);
//     return { status: 0, message: "Invalid Call Try Again" };
//   }
// };


var insertQuiz = async (data) => {
  try {
    let checkQuizSql = `Select * from quiz where u_id = ${data.u_id} and quiz_type=${data.quiz_type} and attempt = ${data.attempt} and q_id IN (${data.ansList.map(item => item.question_id)})`;
    let checkQuizExist = await new Promise((resolve, reject) => {
      con.query(checkQuizSql, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            resolve({
              status: 0,
              data: result.length,
            });
          } else {
            resolve({
              status: 1,
              data: 0,
            });
          }
        }
      });
    });
    console.log(checkQuizExist, "checkQuizExist");
    let response = await new Promise(async (resolve, reject) => {
      if (checkQuizExist.status == 1 && checkQuizExist.data == 0) {
        let total_correct_ans = 0;
        let total_wrong_ans = 0;
        for (let i = 0; i < data.ansList.length; i++) {
          let getOption = `Select o_id from options where q_id = ${data.ansList[i].question_id} and ans = 1 and deleted = 0`;
          let resp = await new Promise(async (resolve, reject) => {
            con.query(getOption, function (err1, result1) {
              if (err1) {
                console.log(err1);
                resolve({ status: 0, message: "Something went to wrong" });
              } else {
                if (result1.length > 0) {
                  let sql = `Insert into quiz (u_id,quiz_type,v_id,q_id,ans_id,correct_ans,attempt) values (${data.u_id},${data.quiz_type},${data.v_id},${data.ansList[i].question_id},${data.ansList[i].answer},${result1[0].o_id},${data.attempt})`;
                  con.query(sql, function (err, result) {
                    if (err) {
                      console.log(err);
                      resolve({ status: 0, message: "Something went to wrong" });
                    } else {
                      if (result.affectedRows > 0) {
                        if (data.ansList[i].answer == result1[0].o_id) {
                          total_correct_ans = total_correct_ans + 1;
                        } else {
                          total_wrong_ans = total_wrong_ans + 1;
                        }
                        resolve({
                          status: 1,
                          message: "Quiz Submitted Successfully...",
                        });
                      } else {
                        resolve({
                          status: 1,
                          message: "Quiz not Submitted...",
                        });
                      }
                    }
                  });
                } else {
                  resolve({
                    status: 1,
                    message: "Quiz not Submitted...",
                  });
                }
              }
            });
          });

          if (data.ansList.length - 1 == i) {
            resolve({
              status: 1,
              message: "Quiz Submitted Successfully...",
            });
          }
        }
        let insertResult = `Insert into quiz_result (u_id,v_id,attempt,quiz_type,total_question,total_correct_ans,total_wrong_ans) VALUES (${data.u_id},${data.v_id},${data.attempt},${data.quiz_type},${data.total_question},${total_correct_ans},${total_wrong_ans})`;
        let resp1 = await new Promise(async (resolve, reject) => {
          con.query(insertResult, function (err2, result2) {
            if (err2) {
              console.log(err2);
              resolve({ status: 0, message: "Something went to wrong" });
            } else {
              if (result2.affectedRows > 0) {
                resolve({
                  status: 1,
                  message: "Result inserted Successfully...",
                });
              } else {
                resolve({
                  status: 1,
                  message: "Result not  inserted ...",
                });
              }
            }
          });
        });
      } else {
        console.log("Already Exists...");
        resolve({
          status: 1,
          message: "Result inserted Successfully...",
        });
      }
    });

    return response;
  } catch (error) {
    console.log(error);
    return { status: 0, message: "Invalid Call Try Again" };
  }
};
var getQuizResult = async (data) => {
  try {
    let sql = `select * from quiz_result where u_id = ${data.u_id} and v_id = ${data.v_id} and quiz_type=${data.quiz_type}   order by q_r_id DESC limit 1`;
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

var getQuizReport = async (data) => {
  try {
    let totalResult = `Select q1.attempt,q1.u_id,q1.v_id,q1.total_question,users.name as u_name,videos.v_name,q1.total_correct_ans as post_correct_ans,(SELECT total_correct_ans from quiz_result q2 where q2.quiz_type = 0 and q2.v_id = q1.v_id and q2.u_id = q1.u_id)as pre_correct_ans from quiz_result q1 left join users on users.u_id = q1.u_id left join videos on videos.v_id = q1.v_id where q1.quiz_type = 1 and q1.q_r_id IN (  
      SELECT MAX(q_r_id)
         FROM quiz_result  where quiz_result.quiz_type = 1
     GROUP BY u_id,v_id) `;
    if (
      typeof data.u_name != "undefined" &&
      data.u_name != "" &&
      data.u_name != 0
    ) {
      totalResult += ` and (users.name like '%${data.u_name}%' OR videos.v_name like '%${data.u_name}%' )`;
    }

    let resp = await new Promise((resolve, reject) => {
      con.query(totalResult, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            resolve({
              status: 1,
              data: result.length,
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

    let sql = `Select q1.attempt,q1.u_id,q1.v_id,q1.total_question,users.name as u_name,videos.v_name,q1.total_correct_ans as post_correct_ans,(SELECT total_correct_ans from quiz_result q2 where q2.quiz_type = 0 and q2.v_id = q1.v_id and q2.u_id = q1.u_id)as pre_correct_ans from quiz_result q1 left join users on users.u_id = q1.u_id left join videos on videos.v_id = q1.v_id where q1.quiz_type = 1 and q1.q_r_id IN (  
    SELECT MAX(q_r_id)
       FROM quiz_result  where quiz_result.quiz_type = 1
   GROUP BY u_id,v_id) `;
    if (
      typeof data.u_name != "undefined" &&
      data.u_name != "" &&
      data.u_name != 0
    ) {
      sql += ` and (users.name like '%${data.u_name}%' OR videos.v_name like '%${data.u_name}%' )`;
    }
    sql += ` limit ${(parseInt(data.page) - 1) * parseInt(data.perPage)
      },${parseInt(data.perPage)}`;

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
              total_user: resp.data,
            });
          } else {
            resolve({
              status: 0,
              data: [],
              total_user: 0,
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

var getExcelQuizReport = async (data) => {
  try {
    let totalResult = `Select q1.attempt,q1.u_id,q1.v_id,q1.total_question,users.name as u_name,videos.v_name,q1.total_correct_ans as post_correct_ans,(SELECT total_correct_ans from quiz_result q2 where q2.quiz_type = 0 and q2.v_id = q1.v_id and q2.u_id = q1.u_id)as pre_correct_ans from quiz_result q1 left join users on users.u_id = q1.u_id left join videos on videos.v_id = q1.v_id where q1.quiz_type = 1 and q1.q_r_id IN (SELECT MAX(q_r_id) FROM quiz_result  where quiz_result.quiz_type = 1 GROUP BY u_id,v_id)`;
    if (
      typeof data.u_name != "undefined" &&
      data.u_name != "" &&
      data.u_name != 0
    ) {
      totalResult += ` and (users.name like '%${data.u_name}%' OR videos.v_name like '%${data.u_name}%' )`;
    }
    console.log(totalResult, "totalResult");
    let response = await new Promise((resolve, reject) => {
      con.query(totalResult, function (err, result) {
        console.log(result, err, "&&&&&&&&&&&&&&&");

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

var getVideosWithPercentage = async (data) => {
  try {
    //   let sql = `SELECT videos.*,video_player.percentage,quiz_result.total_correct_ans,quiz_result.total_question FROM videos left join video_player on videos.v_id = video_player.v_id and video_player.u_id =${data.u_id} left join quiz_result on quiz_result.v_id = video_player.v_id and quiz_result.u_id = video_player.u_id and quiz_result.quiz_type = 1 and quiz_result.u_id = ${data.u_id} and quiz_result.q_r_id IN (
    //     SELECT MAX(q_r_id)
    //     FROM quiz_result where quiz_result.u_id=${data.u_id} and videos.v_id = quiz_result.v_id and quiz_result.quiz_type = 1
    //     GROUP BY v_id
    // )  WHERE
    // videos.status = 0 and c_id =${data.c_id}; `;
    let sql = `SELECT course.*,videos.*,(Select COUNT(questions.q_id) from questions where questions.v_id  = videos.v_id and questions.status = 0)as total,video_player.percentage,quiz_result.total_correct_ans,quiz_result.total_question FROM course left join videos on videos.c_id = course.c_id left join video_player on videos.v_id = video_player.v_id and video_player.u_id =${data.u_id} left join quiz_result on quiz_result.v_id = video_player.v_id and quiz_result.u_id = video_player.u_id and quiz_result.quiz_type = 1 and quiz_result.u_id = ${data.u_id} and quiz_result.q_r_id IN (  
         SELECT MAX(q_r_id)
         FROM quiz_result where quiz_result.u_id=${data.u_id} and videos.v_id = quiz_result.v_id and quiz_result.quiz_type = 1
       GROUP BY v_id
   )  WHERE 
    videos.status = 0 and course.c_id =${data.c_id}; `;
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

var updateVideoPercentage = async (data) => {
  try {
    let checkPer = `Select * from video_player where v_id = ${data.v_id} and u_id=${data.u_id}`;
    let response = await new Promise((resolve, reject) => {
      con.query(checkPer, function (checkPer_err, checkPer_result) {
        if (checkPer_err) {
          console.log(checkPer_err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (checkPer_result.length > 0) {
            let sql = `Update video_player set percentage = ${data.percentage} where v_id = ${data.v_id} and u_id = ${data.u_id}`;

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
          } else {
            let sql = `Insert into video_player (v_id,percentage,u_id) values (${data.v_id},${data.percentage},${data.u_id})`;
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
                    message: "Video not Updated...",
                  });
                }
              }
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

var getQuestionsForQuiz = async (data) => {
  try {
    let sql = `SELECT *,(row_number() over ( order by questions.q_id ASC) ) AS row_no FROM questions  WHERE questions.v_id =${data.v_id} and questions.status = 0 `;
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
              total_question: result.length,
            });
          } else {
            resolve({
              status: 0,
              data: [],
              total_question: 0,
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

var getCourseWithVideoData = async (data) => {
  try {
    // let sql = `SELECT course.*,v.v_img,v.v_id,COUNT(videos.v_id) AS total_videos FROM course LEFT JOIN videos ON (videos.c_id = course.c_id) LEFT JOIN videos v ON v.v_id = (SELECT vData.v_id FROM videos AS vData where vData.c_id = course.c_id ORDER BY vData.v_id ASC LIMIT 1 ) GROUP BY course.c_id;`;
    let sql = `SELECT course.*,videos.v_id,videos.v_img,COUNT(videos.v_id) AS total_videos FROM course LEFT JOIN videos ON videos.c_id = course.c_id GROUP BY course.c_id;`;
    let response = await new Promise((resolve, reject) => {
      con.query(sql, async function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            let course = [];
            for (let i = 0; i < result.length; i++) {
              const courseData = await getVideosWithPercentage({
                u_id: data.u_id,
                c_id: result[i].c_id,
              });
              course.push({ ...result[i], videoList: courseData.data });
            }
            resolve({
              status: 1,
              data: course,
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

var downloadAllUserReport = async (data) => {
  try {
    let headerArray = [];
    let getUser = `SELECT users.*,certificates.created_timestamp as certificateDate,attributes.name as specialty_name,a1.name as typeofwork,a2.name as areaofwork,a3.name as exactareaofwork,a4.name as memberof FROM users left join certificates on certificates.u_id = users.u_id left join attributes on attributes.attribute_id = users.specialty left join attributes a1 on a1.attribute_id = users.type_of_work left join attributes a2 on a2.attribute_id = users.area_of_work left join attributes a3 on a3.attribute_id = users.exact_area_of_work left join attributes a4 on a4.attribute_id = users.member_of where users.type = 1 and users.certificate_status = 1;`;
    let userResp = await new Promise(async (resolve, reject) => {
      con.query(getUser, async function (getUser_err, getUser_result) {
        if (getUser_err) {
          console.log(getUser_err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (getUser_result.length > 0) {
            resolve(getUser_result);
          } else {
            resolve([]);
          }
        }
      });
    });
    const workbook = new ExcelJS.Workbook();
    const userWorksheet = workbook.addWorksheet(`${data.type == 0 ? "Pre " : "Post"}Quiz User Report`);

    let userArray = ["Registered Date", "Full Name", "Email Address", "Mobile Number", "Gender", "Age", "Marital Status", "No. of Children", "Address", "City", "Pincode", "Qualification", "Specialty", "Name of Organization", "Type of work", "Year of Experience", "Area of Work", "Exact Area of Work", "Member of", "KMC", "KMC Work Area", "KMC Years", "KMC to Children", "Certificate Date", "Score"];
    let getQuestions = `SELECT question from questions WHERE status = 0 Order By q_id ASC`;
    let getQuestionResp = await new Promise((resolve, reject) => {
      con.query(getQuestions, function (getPreResult_err, getPreResult_result) {
        if (getPreResult_err) {
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (getPreResult_result.length > 0) {
            for (let i = 0; i < getPreResult_result.length; i++) {
              headerArray.push(getPreResult_result[i].question);
            }
            resolve(getPreResult_result);
          } else {
            resolve([]);
          }
        }
      });
    });
    const mergedArray = userArray.concat(headerArray);
    userWorksheet.addRow(mergedArray);
    userWorksheet.getRow(userWorksheet.rowCount).eachCell((cell, colNumber) => {
      cell.font = { bold: true };
    });
    const userDataPromises = userResp.map(async user => {
      let quizAnsArray = [];
      let userInfoArray = [moment(user.created_timestamp).format("DD-MM-YYYY"), user.name, user.u_email, user.mobile, user.gender == 0 ? "Male" : "Female", user.age, user.marital_status == 0 ? "Unmarried" : "Married", user.no_of_children, user.address, user.city, user.pincode, user.qualification, user.specialty != 0 ? user.specialty_name : user.other_specialty, user.name_of_organization, user.typeofwork, user.year_of_exp, user.area_of_work == 0 ? user.other_area_of_work : user.areaofwork, user.exact_area_of_work == 0 ? user.exact_other_area_of_work : user.exactareaofwork, user.memberof, user.kmc == 0 ? "No" : "Yes", user.kmc_work_area == 0 ? "No" : "Yes", user.kmc_years, user.kmc_to_children == 0 ? "No" : user.kmc_to_children == 1 ? "Yes" : "Not Applicable", moment(user.certificateDate).format("DD-MM-YYYY")];
      let getPrePostResult = "";
      if (data.type == 0) {
        getPrePostResult = `SELECT quiz.quiz_id,quiz.q_id,quiz.v_id, questions.question, quiz.ans_id,options.name as answer,CASE WHEN quiz.correct_ans <> quiz.ans_id THEN 'true' ELSE 'false' END AS is_correct
    FROM quiz
    JOIN questions ON quiz.q_id = questions.q_id LEFT JOIN options on options.o_id = quiz.ans_id  WHERE quiz.u_id = ${user.u_id} AND quiz.quiz_type = 0  Order By quiz.q_id ASC`;
      } else {
        getPrePostResult = `SELECT
      quiz.quiz_id,quiz.q_id,quiz.v_id,questions.question,quiz.ans_id,options.name AS answer,CASE WHEN quiz.correct_ans <> quiz.ans_id THEN 'true' ELSE 'false' END AS is_correct FROM quiz JOIN questions ON quiz.q_id = questions.q_id LEFT JOIN
      options ON options.o_id = quiz.ans_id JOIN (SELECT q_id,v_id,u_id,MAX(attempt) AS max_attempt FROM quiz WHERE u_id = ${user.u_id} AND quiz_type = 1 GROUP BY q_id, v_id, u_id) AS max_attempts ON quiz.q_id = max_attempts.q_id AND quiz.v_id = max_attempts.v_id AND quiz.u_id = max_attempts.u_id AND quiz.attempt = max_attempts.max_attempt WHERE quiz.u_id = ${user.u_id} AND quiz.quiz_type = 1 ORDER BY quiz.q_id ASC;`;
      };
      let prePostResult = await new Promise((resolve, reject) => {
        con.query(getPrePostResult, function (getPreResult_err, getPreResult_result) {
          if (getPreResult_err) {
            resolve({ status: 0, message: "Something went to wrong" });
          } else {
            if (getPreResult_result.length > 0) {
              resolve(getPreResult_result);
            } else {
              resolve([]);
            }
          }
        });
      });
      if (prePostResult.length > 0) {
        let totalScore = 0;
        prePostResult.forEach(row => {
          totalScore = row.is_correct == 'false' ? totalScore + 1 : totalScore;
          quizAnsArray.push(`${row.is_correct == 'false' ? '✅' : '❌'} ${row.answer}`);
          // quizAnsArray.push(`${row.q_id}_${row.is_correct == 'false' ? '✅' : '❌'} ${row.answer}`);
        });
        const scoreData = [`${totalScore}/${getQuestionResp.length}`];
        const mergedResultArray = userInfoArray.concat(scoreData);
        const finalMergedResultArray = mergedResultArray.concat(quizAnsArray);
        userWorksheet.addRow(finalMergedResultArray);
      }
      return {
        data: prePostResult
      };
    });
    const userData = await Promise.all(userDataPromises);
    userWorksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'A2' } // Freeze the first row (ySplit: 1)
    ];
    userWorksheet.columns.forEach((column, columnIndex) => {
      column.alignment = { vertical: 'middle', horizontal: 'center' };
      column.width = 30;
      column.alignment.wrapText = true;
    });
    const fileName = path.join(__dirname, "../public/Assets/UserReports/", `User_${data.type == 0 ? 'Pre' : "Post"}_Quiz_Report.xlsx`);
    console.log(fileName, "fileName");
    const buffer = await workbook.xlsx.writeBuffer();
    fs.writeFileSync(fileName, buffer, 'binary');
    console.log(`Excel file generated for User: ${fileName}`);
    return {
      fileName: `User_${data.type == 0 ? 'Pre' : "Post"}_Quiz_Report.xlsx`,
    };
  } catch (error) {
    console.log(error);
    return { status: 0, message: "Invalid Call Try Again" };
  }
};


var getQuizUser = async (data) => {
  try {
    let totalResult = `SELECT COUNT(users.u_id)as total From users where users.type = 1 and certificate_status = 1 `;
    if (
      typeof data.u_name != "undefined" &&
      data.u_name != "" &&
      data.u_name != 0
    ) {
      totalResult += ` and (users.name like '%${data.u_name}%' OR users.u_email like '%${data.u_name}%' OR users.mobile like '%${data.u_name}%' OR users.address like '%${data.u_name}%' OR users.city like '%${data.u_name}%' OR users.pincode like '%${data.u_name}%')`;
    }

    let resp = await new Promise((resolve, reject) => {
      con.query(totalResult, function (err, result) {
        if (err) {
          console.log(err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (result.length > 0) {
            resolve({
              status: 1,
              data: result[0].total,
            });
          } else {
            resolve({
              status: 0,
              data: 0,
            });
          }
        }
      });
    });
    let getUser = `SELECT * From users where users.type = 1 and certificate_status = 1`;
    if (
      typeof data.u_name != "undefined" &&
      data.u_name != "" &&
      data.u_name != 0
    ) {
      getUser += ` and (users.name like '%${data.u_name}%' OR users.u_email like '%${data.u_name}%' OR users.mobile like '%${data.u_name}%' OR users.address like '%${data.u_name}%' OR users.city like '%${data.u_name}%' OR users.pincode like '%${data.u_name}%')`;
    }
    getUser += ` limit ${(parseInt(data.page) - 1) * parseInt(data.perPage)
      },${parseInt(data.perPage)}`;
    let userResp = await new Promise(async (resolve, reject) => {
      con.query(getUser, async function (getUser_err, getUser_result) {
        if (getUser_err) {
          console.log(getUser_err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (getUser_result.length > 0) {
            resolve({ status: 1, data: getUser_result, total_user: resp.data });
          } else {
            resolve({ status: 1, data: [] });
          }
        }
      });
    });
    return userResp;
  } catch (error) {
    console.log(error);
    return { status: 0, message: "Invalid Call Try Again" };
  }
};

var getQuizReportOfUser = async (user) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const userWorksheet = workbook.addWorksheet(`User_${user.u_id} Report`);
    let getVideo = `SELECT DISTINCT v_id, v_name FROM videos where status = 0`;
    let videoRows = await new Promise(async (resolve, reject) => {
      con.query(getVideo, async function (getVideo_err, getVideo_result) {
        if (getVideo_err) {
          console.log(getVideo_err);
          resolve({ status: 0, message: "Something went to wrong" });
        } else {
          if (getVideo_result.length > 0) {
            resolve(getVideo_result);
          } else {
            resolve([]);
          }
        }
      });
    });
    userWorksheet.addRow([user.name]);
    userWorksheet.getCell('A1').font = { bold: true, size: 24 };
    const videoDataPromises = videoRows.map(async video => {
      let quizResult = `Select q1.attempt,q1.u_id,q1.v_id,q1.total_question,q1.total_correct_ans as post_correct_ans,(SELECT total_correct_ans from quiz_result q2 where q2.quiz_type = 0 and q2.v_id = q1.v_id and q2.u_id = q1.u_id)as pre_correct_ans from quiz_result q1 where q1.quiz_type = 1 AND q1.u_id = ${user.u_id} AND q1.v_id = ${video.v_id} AND q1.attempt = (SELECT MAX(attempt) FROM quiz_result where quiz_result.u_id = ${user.u_id} AND quiz_result.v_id = ${video.v_id} AND quiz_result.quiz_type = 1) and q1.q_r_id IN (SELECT MAX(q_r_id) FROM quiz_result where quiz_result.quiz_type = 1 GROUP BY quiz_result.u_id,quiz_result.v_id);`;
      let tableHeaderData = ["Total Questions", "Pre Correct Answer", "Post Correct Answer", "Total Attempt"];
      let tableContentData;
      let quizResultResp = await new Promise(async (resolve, reject) => {
        con.query(quizResult, async function (quizResult_err, quizResult_result) {
          if (quizResult_err) {
            console.log(quizResult_err);
            resolve({ status: 0, message: "Something went to wrong" });
          } else {
            if (quizResult_result.length > 0) {
              tableContentData = [quizResult_result[0].total_question, quizResult_result[0].pre_correct_ans, quizResult_result[0].post_correct_ans, quizResult_result[0].attempt];
              resolve({ status: 1 });
            } else {
              resolve({ status: 0 });
            }
          }
        });
      });
      let getPrePostResult = `SELECT q.q_id AS question_id,q.question,MAX(CASE WHEN quiz.quiz_type = 0 THEN o.name END) AS pre_quiz_answer,MAX(CASE WHEN quiz.quiz_type = 0 THEN CASE WHEN quiz.correct_ans <> quiz.ans_id THEN 'true' ELSE 'false' END
        END) AS pre_is_correct,MAX(CASE WHEN quiz.quiz_type = 1 THEN o.name END) AS post_quiz_answer,MAX(CASE WHEN quiz.quiz_type = 1 THEN CASE WHEN quiz.correct_ans <> quiz.ans_id THEN 'true' ELSE 'false' END END) AS post_is_correct FROM
        questions q LEFT JOIN quiz ON quiz.q_id = q.q_id LEFT JOIN options o ON o.o_id = quiz.ans_id WHERE quiz.u_id = ${user.u_id} AND quiz.v_id = ${video.v_id} AND (quiz.quiz_type = 0 OR (quiz.quiz_type = 1 AND quiz.attempt = (SELECT MAX(attempt) FROM quiz WHERE u_id = ${user.u_id} AND v_id = ${video.v_id} AND quiz_type = 1))) GROUP BY q.q_id, q.question`;
      let prePostResult = await new Promise((resolve, reject) => {
        con.query(getPrePostResult, function (getPrePostResult_err, getPrePostResult_result) {
          if (getPrePostResult_err) {
            resolve({ status: 0, message: "Something went to wrong" });
          } else {
            if (getPrePostResult_result.length > 0) {
              resolve(getPrePostResult_result);
            } else {
              resolve([]);
            }
          }
        });
      });
      if (prePostResult.length > 0) {
        userWorksheet.addRow([video.v_name]);
        userWorksheet.getCell(`A${userWorksheet.lastRow.number}`).font = { bold: true, size: 18 };
        userWorksheet.addRow({});
        userWorksheet.addRow(tableHeaderData);
        userWorksheet.getRow(userWorksheet.rowCount).eachCell((cell, colNumber) => {
          cell.font = { bold: true };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
        userWorksheet.addRow(tableContentData);
        userWorksheet.getRow(userWorksheet.rowCount).eachCell((cell, colNumber) => {
          cell.font = { bold: true };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
        userWorksheet.addRow({});
        userWorksheet.addRow(['Question', 'Pre-Quiz Answer', 'Post-Quiz Answer']);
        userWorksheet.getRow(userWorksheet.lastRow.number).eachCell((cell) => {
          cell.font = { bold: true };
        });
      }
      if (prePostResult.length > 0) {
        prePostResult.forEach(row => {
          userWorksheet.addRow([row.question, `${row.pre_is_correct == 'false' ? '✅' : '❌'} ${row.pre_quiz_answer}`, `${row.post_is_correct == 'false' ? '✅' : '❌'} ${row.post_quiz_answer}`]);
        });
      }
      userWorksheet.addRow({});
      return {
        video_id: video.v_id,
        video_name: video.v_name,
        questions: prePostResult,
      };
    });

    const videoData = await Promise.all(videoDataPromises);
    userWorksheet.columns.forEach((column, columnIndex) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const length = cell.value ? cell.value.toString().length : 0;
        if (length > maxLength) {
          maxLength = length;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });
    const filePath = path.join(__dirname, "../public/Assets/UserReports/", `user_${user.u_id}_quiz_data.xlsx`);
    const buffer = await workbook.xlsx.writeBuffer();
    fs.writeFileSync(filePath, buffer, 'binary');
    console.log(`Excel file generated for User ${user.u_id}: ${filePath}`);
    return {
      u_id: user.u_id
    };
  } catch (error) {
    console.log(error);
    return { status: 0, message: "Invalid Call Try Again" };
  }
};

module.exports = {
  insertQuiz,
  getQuizResult,
  getQuizReport,
  getExcelQuizReport,
  getVideosWithPercentage,
  updateVideoPercentage,
  getQuestionsForQuiz,
  getCourseWithVideoData,
  getQuizReportOfUser,
  getQuizUser,
  downloadAllUserReport
};
