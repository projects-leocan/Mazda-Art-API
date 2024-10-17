// // getSubmitArtStatisticsController
// const pool = require("../../config/db");
// const lodash = require("lodash");
// const { somethingWentWrong } = require("../../constants/messages");
// const {
//   short_listed,
//   rejected,
//   scholarship_winner,
//   grant_winner,
//   nominated,
// } = require("../../constants/grantConstants");

// exports.getGrantWiseSubmitArtStatisticsController = async (req, res) => {
//   const { admin_id } = req.query;
//   try {
//     const query = `SELECT
//         (SELECT COUNT(*) from trasaction_detail WHERE trasaction_status = 'SUCCESS') as total_transaction,
//         (SELECT COUNT(*) from submission_details) as total_art_submission,
//         (SELECT COUNT(*) from submission_details WHERE status = '${rejected}') as rejected,
//         (SELECT COUNT(*) from submission_details WHERE status = '${short_listed}') as short_listed,
//         (SELECT COUNT(*) from submission_details WHERE status = '${scholarship_winner}') as scholarship_winner,
//         (SELECT COUNT(*) from submission_details WHERE status = '${grant_winner}') as grant_winner,
//         (SELECT COUNT(*) from submission_details WHERE status = '${nominated}') as nominated
//     `;

//     pool.query(query, async (err, result) => {
//       if (err) {
//         // console.log(`error: ${err}`);
//         return res.status(500).send({
//           success: false,
//           message: somethingWentWrong,
//           statusCode: 500,
//         });
//       } else {
//         // convert data string to int
//         const convertedData = result.rows.map((entry) => {
//           const convertedEntry = {};
//           for (const value in entry) {
//             if (entry[value] === null) {
//               convertedEntry[value] = 0;
//             } else if (typeof entry[value] === "string") {
//               convertedEntry[value] = parseInt(entry[value], 10);
//             } else {
//               convertedEntry[value] = entry[value];
//             }
//           }
//           return convertedEntry;
//         });
//         return res.status(200).send({
//           success: true,
//           message: "Dashboard Statistics fetch Successfully",
//           statusCode: 200,
//           data: convertedData[0],
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
const { somethingWentWrong } = require("../../constants/messages");
const {
  short_listed,
  rejected,
  scholarship_winner,
  grant_winner,
  nominated,
} = require("../../constants/grantConstants");

exports.getGrantWiseSubmitArtStatisticsController = async (req, res) => {
  try {
    const query = `WITH transaction_counts AS (
    SELECT
        grant_id,
        COUNT(DISTINCT id) AS total_transaction
    FROM 
        trasaction_detail
    WHERE
        trasaction_status = 'SUCCESS'
    GROUP BY
        grant_id
),
submission_status_counts AS (
    SELECT
        artwork_id,
        COUNT(CASE WHEN status = '${rejected}' THEN 1 END) AS rejected,
        COUNT(CASE WHEN status = '${short_listed}' THEN 1 END) AS short_listed,
        COUNT(CASE WHEN status = '${scholarship_winner}' THEN 1 END) AS scholarship_winner,
        COUNT(CASE WHEN status = '${grant_winner}' THEN 1 END) AS grant_winner,
        COUNT(CASE WHEN status = '${nominated}' THEN 1 END) AS nominated
    FROM 
        submission_admin_review
    GROUP BY 
        artwork_id
)
SELECT 
    g.grant_uid,
    COALESCE(tc.total_transaction, 0) AS total_transaction,
    COUNT(sd.id) AS total_art_submission,
    COALESCE(SUM(ssc.rejected), 0) AS rejected,
    COALESCE(SUM(ssc.short_listed), 0) AS short_listed,
    COALESCE(SUM(ssc.scholarship_winner), 0) AS scholarship_winner,
    COALESCE(SUM(ssc.grant_winner), 0) AS grant_winner,
    COALESCE(SUM(ssc.nominated), 0) AS nominated
FROM 
    submission_details sd
JOIN 
    grants g ON sd.grant_id = g.grant_id
LEFT JOIN 
    transaction_counts tc ON sd.grant_id = tc.grant_id
LEFT JOIN 
    submission_status_counts ssc ON sd.id = ssc.artwork_id
GROUP BY 
    g.grant_uid, tc.total_transaction
    `;
    // console.log("query", query);
    pool.query(query, (err, result) => {
      if (err) {
        // console.error(`Error: ${err}`);
        return res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        // Convert numeric data fields to integers, but keep grant_uid as a string
        const convertedData = result?.rows?.map((entry) => {
          const convertedEntry = {};
          for (const value in entry) {
            if (entry[value] === null) {
              convertedEntry[value] = 0;
            } else if (
              typeof entry[value] === "string" &&
              value !== "grant_uid"
            ) {
              convertedEntry[value] = parseInt(entry[value], 10);
            } else {
              convertedEntry[value] = entry[value];
            }
          }
          return convertedEntry;
        });

        return res.status(200).send({
          success: true,
          message: "Dashboard Statistics fetched Successfully",
          statusCode: 200,
          data: convertedData,
        });
      }
    });
  } catch (error) {
    // console.error(`Error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
