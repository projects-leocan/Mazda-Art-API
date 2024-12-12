// const crypto = require("crypto");
// require("dotenv").config();
// const { v4: uuidv4 } = require("uuid");
// const { somethingWentWrong } = require("../../constants/messages");
// const {
//   getTransactionDetails,
// } = require("../transactions/getTransactionDetails");
// const sgMail = require("@sendgrid/mail");
// const pool = require("../../config/db");
// const Razorpay = require("razorpay");
// const { sendEmail } = require("../emailControllers/sendEmailController");

// exports.verifyPaymentController = async (req, res) => {
//   try {
//     const {
//       order_id,
//       payment_id,
//       signature,
//       artist_id,
//       grant_id,
//       transaction_amount,
//       payment_init_date,
//       no_of_submission,
//     } = req.body;

//     const instance = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });

//     const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
//     shasum.update(`${order_id}|${payment_id}`);
//     const expectedSignature = shasum.digest("hex");
//     // console.log("signature", signature);
//     // console.log("expectedSignature", expectedSignature);

//     if (signature === expectedSignature) {
//       const paymentDetails = await instance.payments.fetch(payment_id);
//       // console.log("payment statys", paymentDetails.status);
//       if (paymentDetails.status === "captured") {
//         const query = `INSERT INTO trasaction_detail(
//         artist_id, grant_id, trasaction_id, payment_init_date, trasaction_status, trasaction_amount, payment_success_date, order_id, signature, no_of_submission)
//         VALUES (${artist_id}, ${grant_id}, '${payment_id}', '${payment_init_date}', 'SUCCESS', '${transaction_amount}', CURRENT_TIMESTAMP, '${order_id}', '${signature}', ${no_of_submission}) RETURNING id, trasaction_id`;

//         pool.query(query, async (error, result) => {
//           // console.log("error", error);
//           if (error) {
//             return res.status(500).send({
//               success: false,
//               message: somethingWentWrong,
//               statusCode: 500,
//             });
//           } else {
//             try {
//               const transfer = await instance.payments.transfer(payment_id, {
//                 transfers: [
//                   {
//                     account: "acc_PCoIJt4VAOWuIe",
//                     amount: transaction_amount * 100,
//                     currency: "INR",
//                     notes: {
//                       // name: "Rubeka",
//                     },
//                   },
//                 ],
//               });

//               const transactionDetails = await getTransactionDetails(
//                 result.rows[0].id,
//                 "Payment Successful!",
//                 res
//               );

//               const query = `SELECT
//               td.*,
//               g.grant_uid,
//               a.fname,
//               a.lname,
//               a.email
//               FROM
//               trasaction_detail td, artist a, grants g
//               WHERE
//               td.id = ${result.rows[0].id} AND td.grant_id = g.grant_id AND td.artist_id = a.artist_id;`;

//               const transaction_detail = await pool.query(query);

//               sendEmail(transaction_detail?.rows[0]?.email, "3", {
//                 name: `${transaction_detail?.rows[0]?.fname} ${transaction_detail?.rows[0]?.lname}`,
//                 grant_id: transaction_detail?.rows[0]?.grant_uid,
//                 transaction_id: transaction_detail?.rows[0]?.trasaction_id,
//               });
//             } catch (paymentError) {
//               console.error("Error releasing payment:", paymentError);

//               return res
//                 .status(500)
//                 .json({ message: "Error releasing payment" });
//             }
//           }
//         });
//       } else if (paymentDetails.status === "failed") {
//         const query = `INSERT INTO trasaction_detail(
//           artist_id, grant_id, trasaction_id, payment_init_date, trasaction_status, trasaction_amount, payment_success_date, order_id, signature)
//           VALUES (${artist_id}, ${grant_id}, '${payment_id}', '${payment_init_date}', 'Failed', '${transaction_amount}', CURRENT_TIMESTAMP, '${order_id}', '${signature}') RETURNING id, trasaction_id`;

//         // return res.status(500).json({ message: "Payment failed" });
//         pool.query(query, async (error, result) => {
//           // console.log("error", error);
//           if (error) {
//             return res.status(500).send({
//               success: false,
//               message: somethingWentWrong,
//               statusCode: 500,
//             });
//           } else {
//             try {
//             } catch (paymentError) {
//               console.error("Error releasing payment:", paymentError);

//               return res.status(500).json({ message: "Payment failed" });
//             }
//           }
//         });
//       }
//     } else {
//       return res.status(400).json({ message: "Payment failed" });
//     }
//   } catch (error) {
//     // console.error("error", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error,
//     });
//   }
// };
