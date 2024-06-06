const pool = require("../../config/db");
const { email, password } = require("../../constants/mailData");
const { somethingWentWrong } = require("../../constants/messages");
const _ = require("lodash");
const fs = require("fs");
var nodemailer = require("nodemailer");
const { sendEmail } = require("../../constants/sendEmail");

exports.assignGrantToJuryController = async (req, res) => {
  const { jurys, grant_id, admin_id } = req.body;
  // console.log("assignGrantToJuryController called !!!!!!!!!!");

  try {
    let query = `INSERT INTO grant_assign( jury_id, grant_id, assign_by) `;
    jurys.map((e) => {
      let lastElement = _.last(jurys);
      console.log(`jury_id: ${e.id}`);
      query += `SELECT ${e.id}, ${grant_id}, ${admin_id}
            WHERE NOT EXISTS (
                SELECT 1 FROM grant_assign WHERE jury_id = ${e.id} AND grant_id = ${grant_id}
            )`;

      if (e != lastElement) {
        query += `UNION ALL `;
      }
    });
    // console.log(`query: ${query}`);
    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        const juryData = await Promise.all(
          jurys.map(async (e) => {
            const result = await pool.query(
              `SELECT id, full_name, email, contact_no, address, designation, dob, about, created_at FROM jury WHERE id = ${e.id}`
            );
            return result.rows[0];
          })
        );

        const emailIds = jurys.map((e) => {
          return e.email;
        });
        sendEmail("Grant assign in you", "This is testing mail...", emailIds);
        // nodemailer
        /*var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        host: 'smtp.gmail.com',
                        port: 3030,
                        secure: false,
                        requireTLS: true,
                        user: email,
                        pass: password,
                    }
                });
                
                console.log(`emailIds: ${emailIds}`);
                var mailOptions = {
                    from: email,
                    to: emailIds,
                    subject: 'Grant assign in you',
                    text: 'This is testing mail...'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });*/
        res.status(200).send({
          success: true,
          message: "Grant assigned to Juries successfully.",
          data: juryData,
          statusCode: 200,
        });
      }
    });
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
