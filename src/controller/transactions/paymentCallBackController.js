const crypto = require("crypto");
const pool = require("../../config/db");
require("dotenv").config();
const {
  getTransactionDetails,
} = require("../transactions/getTransactionDetails");
const { somethingWentWrong } = require("../../constants/messages");
const { sendEmail } = require("../emailControllers/sendEmailController");

exports.paymentCallBackController = async (req, res) => {
  // console.log("req ", req);
  try {
    const payuResponse = req.body;
    const { artist } = req.query;

    // Extract necessary parameters from response
    const {
      id,
      artist_id,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      status,
      hash,
    } = payuResponse; // PayU sends these fields in the response

    // console.log("req", req);
    const MERCHANT_KEY = process.env.PAYU_API_KEY;
    const MERCHANT_SALT = process.env.PAYU_SALT;

    // console.log("payuresponse", payuResponse);

    // Construct the hash string for validation
    const hashString = `${MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${MERCHANT_KEY}`;
    const generatedHash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    if (generatedHash !== hash) {
      return res
        .status(400)
        .json({ success: false, message: "Hash validation failed." });
    }

    const query = `INSERT INTO trasaction_detail(
            artist_id, grant_id, trasaction_id, payment_init_date, trasaction_status, trasaction_amount, payment_success_date)
            VALUES (${artist}, ${productinfo}, '${txnid}', CURRENT_TIMESTAMP, '${
      status === "success" ? "SUCCESS" : "FAILED"
    }', ${amount}, CURRENT_TIMESTAMP) RETURNING id, trasaction_id`;

    // console.log("query", query);

    pool.query(query, async (error, result) => {
      if (error) {
        // console.log("error", error);
        return res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        // const transactionDetails = await getTransactionDetails(
        //   result.rows[0].id,
        //   "Payment Successful!",
        //   res
        // );

        const query = `SELECT
            td.*,
            g.grant_uid,
            g.submission_end_date,
            a.fname,
            a.lname,
            a.email
            FROM
            trasaction_detail td, artist a, grants g
                WHERE
            td.id = ${result.rows[0].id} AND td.grant_id = g.grant_id AND td.artist_id = a.artist_id;`;

        const transaction_detail = await pool.query(query);

        const API_KEY = process.env.SENDGRID_API_KEY;

        // Send response after all operations are complete
        if (status === "success") {
          // console.log("Payment success:", payuResponse);

          sendEmail(transaction_detail?.rows[0]?.email, "3", {
            name: `${transaction_detail?.rows[0]?.fname} ${transaction_detail?.rows[0]?.lname}`,
            grant_id: transaction_detail?.rows[0]?.grant_uid,
            submission_end_date:
              transaction_detail?.rows[0]?.submission_end_date,
          });
          // return res.status(200).json({
          //   success: true,
          //   message: "Payment was successful.",
          //   data: payuResponse,
          // });
          return res.redirect(
            "https://mazdaartfoundation.org/grantsAndScholarship?status=success"
          );
          // return res.redirect(
          //   "http://localhost:4000/grantsAndScholarship?status=success"
          // );
        } else {
          // console.log("Payment failed:", payuResponse);
          // return res.status(400).json({
          //   success: false,
          //   message: "Payment failed.",
          //   data: payuResponse,
          // });

          return res.redirect(
            `https://mazdaartfoundation.org/payment?id=${productinfo}&status=failed`
          );
          // return res.redirect(
          //   `http://localhost:4000/payment?id=${productinfo}&status=failed`
          // );
        }
      }
    });
  } catch (error) {
    // console.error("Error handling payment callback:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
