const crypto = require("crypto");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { somethingWentWrong } = require("../../constants/messages");
const {
  getTransactionDetails,
} = require("../transactions/getTransactionDetails");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const pool = require("../../config/db");

exports.verifyPaymentController = async (req, res) => {
  try {
    const {
      order_id,
      payment_id,
      signature,
      artist_id,
      grant_id,
      transaction_amount,
    } = req.body;
    const uuid = uuidv4();

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${order_id}|${payment_id}`);
    const expectedSignature = shasum.digest("hex");
    if (signature === expectedSignature) {
      const query = `INSERT INTO trasaction_detail(
        artist_id, grant_id, trasaction_id, payment_init_date, trasaction_status, trasaction_amount, payment_success_date, order_id, signature)
        VALUES (${artist_id}, ${grant_id}, '${payment_id}', CURRENT_TIMESTAMP, 'SUCCESS', '${transaction_amount}', CURRENT_TIMESTAMP + INTERVAL '30 seconds', '${order_id}', '${signature}') RETURNING id, trasaction_id`;

      pool.query(query, async (error, result) => {
        // console.log(`error: ${error}`);
        // console.log(`result:`, result);
        if (error) {
          return res.status(500).send({
            success: false,
            message: somethingWentWrong,
            statusCode: 500,
          });
        } else {
          const transactionDetails = await getTransactionDetails(
            result.rows[0].id,
            "Payment Successful!",
            res
          );

          const query = `SELECT 
            td.*, 
            g.grant_uid,
            a.fname,
            a.lname,
            a.email
            FROM 
            trasaction_detail td, artist a, grants g
            WHERE 
            td.id = ${result.rows[0].id} AND td.grant_id = g.grant_id AND td.artist_id = a.artist_id;`;

          const transaction_detail = await pool.query(query);

          const API_KEY = process.env.SENDGRID_API_KEY;

          sgMail.setApiKey(API_KEY);
          const message = {
            to: transaction_detail?.rows[0]?.email,
            from: { name: "Mazda Art", email: "bhavya.leocan@gmail.com" },
            // subject: "Payment Successful - Welcome to Mazda Art!",
            // text: `Your payment was successful!`,
            // html: `
            //   <h1>Welcome to Mazda Art!</h1>
            //   <p>Thank you for your payment. We are thrilled to officially welcome you to the Mazda Art community!</p>
            //   <p>Your payment has been successfully processed, and you now have full access to all the amazing features we offer.</p>
            //   <p>At Mazda Art, we celebrate creativity and expression, and we're excited to see how you'll contribute to our community. If you need any help, feel free to reach out to us anytime.</p>
            //   <p>We’re looking forward to creating something extraordinary together!</p>
            //   <br/>
            //   <p>Best regards,</p>
            //   <p><strong>Mazda Art Team</strong></p>
            // `,
            templateId: "d-e9afaa56d98149908a661a31c6eeb5e8",
            dynamicTemplateData: {
              name: `${transaction_detail?.rows[0]?.fname} ${transaction_detail?.rows[0]?.lname}`,
              grant_id: transaction_detail?.rows[0]?.grant_uid,
              transaction_id: transaction_detail?.rows[0]?.trasaction_id,
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
        }
      });
      // return res.status(200).json({ message: "Payment Verified Successfully" });
    } else {
      return res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    // console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
