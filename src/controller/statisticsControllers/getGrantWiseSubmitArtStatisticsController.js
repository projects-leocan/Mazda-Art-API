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
    const query = `
      SELECT 
        sd.grant_id,
        (SELECT COUNT(*) FROM trasaction_detail WHERE grant_id = sd.grant_id AND trasaction_status = 'SUCCESS') AS total_transaction,
        COUNT(*) AS total_art_submission,
        COUNT(*) FILTER (WHERE sd.status = '${rejected}') AS rejected,
        COUNT(*) FILTER (WHERE sd.status = '${short_listed}') AS short_listed,
        COUNT(*) FILTER (WHERE sd.status = '${scholarship_winner}') AS scholarship_winner,
        COUNT(*) FILTER (WHERE sd.status = '${grant_winner}') AS grant_winner,
        COUNT(*) FILTER (WHERE sd.status = '${nominated}') AS nominated
      FROM 
        submission_details sd
      GROUP BY 
        sd.grant_id;
    `;

    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Error: ${err}`);
        return res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        // Convert data string to int
        const convertedData = result.rows.map((entry) => {
          const convertedEntry = {};
          for (const value in entry) {
            if (entry[value] === null) {
              convertedEntry[value] = 0;
            } else if (typeof entry[value] === "string") {
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
    console.error(`Error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
