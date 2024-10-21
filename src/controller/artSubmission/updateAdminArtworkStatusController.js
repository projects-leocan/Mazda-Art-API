//updateGrantStatusController
const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const { sendEmail } = require("../../constants/sendEmail");
const {
  getFileURLPreFixPath,
} = require("../../constants/getFileURLPreFixPath");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

exports.updateAdminArtworkStatusController = async (req, res) => {
  const {
    admin_id,
    status,
    comment,
    submission_id,
    starts,
    artist_email,
    artist_id,
    art_title,
  } = req.body;
  const reviewStar = starts === undefined || starts === "" ? "0" : starts;

  let juryFindQuery = `SELECT artwork_id FROM submission_admin_review WHERE artwork_id=${submission_id}`;
  const juryFindResult = await pool.query(juryFindQuery);
  let query;
  if (juryFindResult?.rows.length > 0) {
    const artComment = comment === "" || comment === undefined ? null : comment;
    query = `UPDATE submission_admin_review SET status=${status}, comment=${
      comment === "" ? `''` : `'${comment}'`
    }, star_assigned=${reviewStar}`;
    query += ` WHERE artwork_id = ${submission_id}`;
  } else {
    query = `INSERT INTO submission_admin_review(
        artwork_id, admin_id, status, comment, star_assigned)
        VALUES (${submission_id}, ${admin_id}, ${status}, '${comment}', '${reviewStar}');`;
  }

  // console.log("query", query);
  pool.query(query, async (err, result) => {
    if (err) {
      // console.log("err", err);
      res.status(500).send({
        success: false,
        message: somethingWentWrong,
        statusCode: 500,
      });
    } else {
      if (status === "3") {
        // decline mail
        // sendEmail(
        //   "Grant request decline",
        //   `Your grant request has been decline.`,
        //   artist_email
        // );
      } else if (status === "4") {
        //accept mail
        // sendEmail(
        //   "Grant request accepted",
        //   `Your grant request has been accepted.`,
        //   artist_email
        // );
      }
      const detailQuery = `SELECT * FROM submission_details WHERE artwork_id = ${submission_id}`;
      pool.query(detailQuery, async (err, result) => {
        if (err) {
          // console.log("error", err);
          return res.status(500).send({
            success: true,
            message: "Grant Status Updated Successfully. can not fetch detail",
            statusCode: 500,
          });
        } else {
          // const prePath = getFileURLPreFixPath(req);

          // const finalResponse = {
          //   ...result.rows[0],
          //   art_file:
          //     prePath +
          //     artistGrantSubmissionFilesPath +
          //     result.rows[0].art_file,
          // };
          // delete finalResponse.artist_id;
          // delete finalResponse.transaction_id;

          const artistNameQuery = `SELECT fname, lname, email FROM artist WHERE artist_id=${artist_id}`;
          const artistNameQueryExecute = await pool.query(artistNameQuery);

          const API_KEY = process.env.SENDGRID_API_KEY;

          sgMail.setApiKey(API_KEY);
          const artwork_status = `${
            status === "1"
              ? "Submitted"
              : status === "5"
              ? "Grant Winner"
              : status === "3"
              ? "Nominated"
              : status === "4"
              ? "Disqualified"
              : "In Review"
          }`;

          // console.log("result woes", result?.rows);

          const info = `${
            status === "5"
              ? `Congratulations! Your artwork ${art_title} has been selected as a grant winner. We are thrilled to offer you this recognition for your exceptional creativity and contribution.`
              : status === "3"
              ? `We are pleased to inform you that your artwork ${art_title} has been nominated for further consideration. We appreciate your patience during this process and will notify you as soon as we have an update regarding its progress.`
              : status === "4"
              ? `We are sorry to inform you that your artwork ${art_title} has been rejected for further consideration.`
              : `Your artwork which is ${art_title} is currently under review by our team. We appreciate your patience during this process and will notify you as soon as we have an update regarding its progress.`
          } `;

          const message = {
            to: "shweta.leocan@gmail.com",
            from: {
              name: "Mazda Art",
              email: "bhavya.leocan@gmail.com",
            },
            // subject: `Artwork Submission Status Update: ${
            //   status === "1"
            //     ? "Submitted"
            //     : status === "5"
            //     ? "Grant Winner"
            //     : status === "3"
            //     ? "Nominated"
            //     : status === "4"
            //     ? "Disqualify"
            //     : "In Review"
            // }`, // Dynamic subject based on status
            // html: `
            //   <h1>Status Update: ${
            //     status === "1"
            //       ? "Submitted"
            //       : status === "5"
            //       ? "Grant Winner"
            //       : status === "3"
            //       ? "Nominated"
            //       : status === "4"
            //       ? "Disqualify"
            //       : "In Review"
            //   }</h1> <!-- Dynamic status -->
            //   <p>Hello !!</p>
            //   <p>We wanted to update you regarding your artwork submission. Your current submission status is <strong>${
            //     status === "1"
            //       ? "Submitted"
            //       : status === "5"
            //       ? "Grant Winner"
            //       : status === "3"
            //       ? "Nominated"
            //       : status === "4"
            //       ? "Disqualify"
            //       : "In Review"
            //   }</strong>.</p> <!-- Dynamic status -->

            //   ${
            //     status === "5"
            //       ? `
            //   <p>Congratulations! Your artwork has been selected as a grant winner. We are thrilled to offer you this recognition for your exceptional creativity and contribution.</p>
            //   <p>Our team will reach out soon with the next steps to proceed.</p>
            //   `
            //       : status === "3"
            //       ? `
            //   <p>We are pleased to inform you that your artwork has been nominated for further consideration. This is an exciting step toward potential selection, and we’re eager to see where your journey takes you!</p>
            //   `
            //       : status === "4"
            //       ? `
            //   <p>We are sorry to inform you that your artwork has been rejected for further consideration.</p>
            //   `
            //       : `
            //   <p>Your artwork is currently under review by our team. We will notify you as soon as there is an update on its progress.</p>
            //   `
            //   }

            //   <p>If you have any questions or need assistance, feel free to reach out to us.</p>
            //   <br/>
            //   <p>Best regards,</p>
            //   <p><strong>Mazda Art Team</strong></p>
            // `,
            templateId: "d-c1ccd4a2619744a5a7b3b8be4cdda9a5",
            dynamicTemplateData: {
              status: artwork_status,
              name: `${artistNameQueryExecute?.rows[0]?.fname} ${artistNameQueryExecute?.rows[0]?.lname}`,
              info: info,
            },
          };

          sgMail
            .send(message)
            .then(() => {
              console.log("Email sent");
            })
            .catch((error) => {
              console.error("Error sending email:", error);
            });

          return res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Grant Status Updated Successfully",
            // data: finalResponse,
          });
        }
      });
    }
  });
};
try {
  const juryAssignQuery = ``;
} catch (error) {
  // console.log(`error: ${error}`);
  return res.status(500).send({
    success: false,
    message: somethingWentWrong,
    statusCode: 500,
  });
}
