const pool = require("../../config/db");
const _ = require("lodash");

const { somethingWentWrong } = require("../../constants/messages");
const {
  getTransactionDetailsController,
} = require("./getTransactionDetailsController");
const { getTransactionDetails } = require("./getTransactionDetails");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

exports.addTransactionController = async (req, res) => {
  const {
    artist_id,
    grant_id,
    // transaction_id,
    // payment_init_date,
    // payment_status,
    transaction_amount,
    // payment_success_date,
  } = req.body;
  const uuid = uuidv4();
  const currentTime = new Date();
  const threeMinutesAgo = new Date(currentTime.getTime() - 3 * 60 * 1000);

  try {
    const query = `INSERT INTO trasaction_detail(
        artist_id, grant_id, trasaction_id, payment_init_date, trasaction_status, trasaction_amount, payment_success_date)
        VALUES (${artist_id}, ${grant_id}, '${uuid}', CURRENT_TIMESTAMP, 'SUCCESS', '${transaction_amount}', CURRENT_TIMESTAMP + INTERVAL '30 seconds') RETURNING id, trasaction_id`;

    // console.log("query", query);

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

        const message = {
          to: transaction_detail?.rows[0]?.email,
          from: {
            name: process.env.SENDGRID_EMAIL_NAME,
            email: process.env.FROM_EMAIL,
          },
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
      }
    });
  } catch (error) {
    // console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
