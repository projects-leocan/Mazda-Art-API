// const pool = require("../../config/db");
// const { email, password } = require("../../constants/mailData");
// const { somethingWentWrong } = require("../../constants/messages");
// const _ = require("lodash");
// const fs = require("fs");
// var nodemailer = require("nodemailer");
// const { sendEmail } = require("../../constants/sendEmail");

// exports.assignGrantToJuryController = async (req, res) => {
//   const { jurys, grant_id, admin_id } = req.body;
//   // console.log("assignGrantToJuryController called !!!!!!!!!!");
//   console.log("jury", jurys);

//   try {
//     let query = `INSERT INTO grant_assign( jury_id, grant_id, assign_by) `;
//     jurys.map((e) => {
//       let lastElement = _.last(jurys);
//       // console.log(`jury_id: ${e.id}`);
//       query += `SELECT ${e.id}, ${grant_id}, ${admin_id}
//             WHERE NOT EXISTS (
//                 SELECT 1 FROM grant_assign WHERE jury_id = ${e.id} AND grant_id = ${grant_id}
//             )`;

//       if (e != lastElement) {
//         query += `UNION ALL `;
//       }
//     });
//     // console.log(`query: ${query}`);
//     pool.query(query, async (err, result) => {
//       // console.log(`err: ${err}`);
//       // console.log(`result: ${JSON.stringify(result)}`);
//       if (err) {
//         res.status(500).send({
//           success: false,
//           message: err,
//           statusCode: 500,
//         });
//       } else {
//         const juryData = await Promise.all(
//           jurys.map(async (e) => {
//             const result = await pool.query(
//               `SELECT id, full_name, email, contact_no, address, designation, dob, about, created_at FROM jury WHERE id = ${e.id}`
//             );
//             return result.rows[0];
//           })
//         );

//         const emailIds = jurys.map((e) => {
//           return e.email;
//         });
//         sendEmail("Grant assign in you", "This is testing mail...", emailIds);
//         // nodemailer
//         /*var transporter = nodemailer.createTransport({
//                     service: 'gmail',
//                     auth: {
//                         host: 'smtp.gmail.com',
//                         port: 3030,
//                         secure: false,
//                         requireTLS: true,
//                         user: email,
//                         pass: password,
//                     }
//                 });

//                 console.log(`emailIds: ${emailIds}`);
//                 var mailOptions = {
//                     from: email,
//                     to: emailIds,
//                     subject: 'Grant assign in you',
//                     text: 'This is testing mail...'
//                 };

//                 transporter.sendMail(mailOptions, function (error, info) {
//                     if (error) {
//                         console.log(error);
//                     } else {
//                         console.log('Email sent: ' + info.response);
//                     }
//                 });*/
//         res.status(200).send({
//           success: true,
//           message: "Grant assigned to Juries successfully.",
//           data: juryData,
//           statusCode: 200,
//         });
//       }
//     });
//   } catch (error) {
//     // console.log(`error: ${error}`);
//     return res.status(500).send({
//       success: false,
//       message: somethingWentWrong,
//       statusCode: 500,
//     });
//   }
// };

const pool = require("../../config/db");
const { email, password } = require("../../constants/mailData");
const {
  somethingWentWrong,
  alreadyAssigned,
  partialAssignment,
} = require("../../constants/messages");
const _ = require("lodash");

exports.assignGrantToJuryController = async (req, res) => {
  const { jurys, grant_id, admin_id } = req.body;

  try {
    // Collect all jury IDs for quick lookup
    const juryIds = jurys.map((jury) => jury.id);

    // Check for existing assignments
    let existingAssignmentsQuery = `SELECT jury_id FROM grant_assign WHERE grant_id = ${grant_id} AND jury_id IN (${juryIds.join(
      ","
    )})`;
    const existingAssignmentsResult = await pool.query(
      existingAssignmentsQuery
    );

    const existingAssignedIds = new Set(
      existingAssignmentsResult.rows.map((row) => row.jury_id)
    );

    const notAssignedJuries = jurys.filter(
      (jury) => !existingAssignedIds.has(jury.id)
    );
    const alreadyAssignedJuries = jurys.filter((jury) =>
      existingAssignedIds.has(jury.id)
    );

    // If all jurors are already assigned, return an error message
    if (jurys.length === existingAssignedIds.size) {
      return res.status(500).send({
        success: false,
        message: alreadyAssigned,
        statusCode: 500,
      });
    }

    if (notAssignedJuries.length > 0) {
      // Proceed with inserting new assignments for jurors not yet assigned
      let query = `INSERT INTO grant_assign(jury_id, grant_id, assign_by) `;
      notAssignedJuries.map((e, index) => {
        query += `SELECT ${e.id}, ${grant_id}, ${admin_id}
          WHERE NOT EXISTS (
            SELECT 1 FROM grant_assign WHERE jury_id = ${e.id} AND grant_id = ${grant_id}
          )`;

        if (index !== notAssignedJuries.length - 1) {
          query += ` UNION ALL `;
        }
      });

      await pool.query(query);
    }

    // Fetch updated jury data
    const juryData = await Promise.all(
      notAssignedJuries.map(async (e) => {
        const result = await pool.query(
          `SELECT id, full_name, email, contact_no, address, designation, dob, about, created_at FROM jury WHERE id = ${e.id}`
        );
        return result.rows[0];
      })
    );

    // Prepare response message
    let responseMessage = "";
    if (alreadyAssignedJuries.length > 0) {
      responseMessage +=
        alreadyAssignedJuries
          .map((jury) => `Jury '${jury.full_name}' was already assigned.`)
          .join(" ") + " ";
    }
    if (notAssignedJuries.length > 0) {
      responseMessage += "New jury successfully added.";
    } else if (jurys.length === existingAssignedIds.size) {
      responseMessage = alreadyAssigned;
    }

    // Send email notifications
    const emailIds = notAssignedJuries.map((e) => e.email);
    if (emailIds.length > 0) {
    }

    res.status(200).send({
      success: true,
      message: responseMessage.trim() || alreadyAssigned,
      data: juryData,
      statusCode: 200,
    });
  } catch (error) {
    // console.error(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
