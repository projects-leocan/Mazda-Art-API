// const pool = require("../../config/db");
// const lodash = require("lodash");
// const { somethingWentWrong } = require("../../constants/messages");

// exports.getTransactionStatsController = async (req, res) => {
//   const { admin_id } = req.query;
//   try {
//     const getTodaysTrasactionQuery = `SELECT
//         (SELECT COUNT(*)
//          FROM trasaction_detail
//          WHERE DATE(payment_success_date) = CURRENT_DATE) AS today_transaction,
//         (SELECT SUM(trasaction_amount)
//          FROM trasaction_detail
//          WHERE DATE(payment_success_date) = CURRENT_DATE) AS amount,
//         (SELECT COUNT(*)
//          FROM artist WHERE DATE(created_at) = CURRENT_DATE) AS registration;`;

//     const getYesterdayData = `SELECT
//         (SELECT COUNT(*) FROM trasaction_detail WHERE DATE(payment_success_date) = CURRENT_DATE - INTERVAL '1 day') as yesterdays_transactions,
//         (SELECT SUM(trasaction_amount) FROM trasaction_detail WHERE DATE(payment_success_date) = CURRENT_DATE - INTERVAL '1 day') as amount,
//         (SELECT COUNT(*)
//          FROM artist WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day') AS registration;`;

//     const getCurrentMonthData = `SELECT
//         (SELECT COUNT(*)
//         FROM trasaction_detail
//         WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) AND
//         DATE(payment_success_date) < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') as "current_month_transactions",
//         (SELECT SUM(trasaction_amount) FROM trasaction_detail
//         WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) AND
//         DATE(payment_success_date) < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') as amount,
//         (SELECT COUNT(*)
//          FROM artist WHERE DATE(created_at) >= date_trunc('month', CURRENT_DATE) AND
//         DATE(created_at) < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') AS registration;`;

//     const getLastMonthData = `SELECT
//         (SELECT COUNT(*)
//         FROM trasaction_detail
//         WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
//         AND DATE(payment_success_date) < date_trunc('month', CURRENT_DATE)) as "last_month_transactions",
//         (SELECT SUM(trasaction_amount) FROM trasaction_detail
//         WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
//         AND DATE(payment_success_date) < date_trunc('month', CURRENT_DATE)) as amount,
//         (SELECT COUNT(*)
//         FROM artist WHERE DATE(created_at) >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
//         AND DATE(created_at) < date_trunc('month', CURRENT_DATE)) as registration;`;

//     const getCurrentYearData = `SELECT
//         (SELECT COUNT(*)
//         FROM trasaction_detail
//         WHERE DATE(payment_success_date) >= date_trunc('year', CURRENT_DATE)
//         AND DATE(payment_success_date) < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year') as "current_year_transactions",
//         (SELECT SUM(trasaction_amount) FROM trasaction_detail
//         WHERE DATE(payment_success_date) >= date_trunc('year', CURRENT_DATE)
//         AND DATE(payment_success_date) < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year') as amount,
//         (SELECT COUNT(*)
//         FROM artist WHERE DATE(created_at) >= date_trunc('year', CURRENT_DATE)
//         AND DATE(created_at) < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year') as registration;`;

//     const getLastYearData = `SELECT
//         (SELECT COUNT(*)
//         FROM trasaction_detail
//         WHERE DATE(payment_success_date) >= date_trunc('year', CURRENT_DATE) - INTERVAL '1 year'
//         AND DATE(payment_success_date) < date_trunc('year', CURRENT_DATE)) as "last_year_transactions",
//         (SELECT SUM(trasaction_amount) FROM trasaction_detail
//         WHERE DATE(payment_success_date) >= date_trunc('year', CURRENT_DATE) - INTERVAL '1 year'
//         AND DATE(payment_success_date) < date_trunc('year', CURRENT_DATE)) as amount,
//         (SELECT COUNT(*)
//          FROM artist WHERE DATE(created_at) >= date_trunc('year', CURRENT_DATE) - INTERVAL '1 year'
//         AND DATE(created_at) < date_trunc('year', CURRENT_DATE)) as registration;`;

//     const queries = [
//       getTodaysTrasactionQuery,
//       getYesterdayData,
//       getCurrentMonthData,
//       getLastMonthData,
//       getCurrentYearData,
//       getLastYearData,
//     ];
//     const allData = await Promise.all(
//       queries.map(async (e) => {
//         return new Promise((resolve, reject) => {
//           pool.query(e, (err, response) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(response.rows[0]);
//             }
//           });
//         });
//       })
//     );
//     // console.log('allData: ', allData);

//     // convert data string to int
//     const convertedData = allData.map((entry) => {
//       const convertedEntry = {};
//       for (const value in entry) {
//         if (entry[value] === null) {
//           convertedEntry[value] = 0;
//         } else if (typeof entry[value] === "string") {
//           convertedEntry[value] = parseInt(entry[value], 10);
//         } else {
//           convertedEntry[value] = entry[value];
//         }
//       }
//       return convertedEntry;
//     });

//     return res.status(200).send({
//       success: true,
//       message: "Transactions fetch Successfully",
//       statusCode: 200,
//       data: convertedData,
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

exports.getTransactionStatsController = async (req, res) => {
  try {
    // Step 1: Get the earliest registration date
    const getEarliestRegistrationQuery = `SELECT MIN(created_at) AS earliest_registration FROM artist`;
    const earliestRegistrationResult = await new Promise((resolve, reject) => {
      pool.query(getEarliestRegistrationQuery, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows[0]);
        }
      });
    });

    const earliestRegistrationDate =
      earliestRegistrationResult.earliest_registration;
    const startDate = new Date(earliestRegistrationDate);
    const currentDate = new Date();

    // Step 2: Generate dynamic queries for each month from the earliest registration date to the current month
    const monthQueries = [];
    let date = new Date(startDate);

    while (date <= currentDate) {
      const yearMonth = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      monthQueries.push(`
        SELECT
          '${yearMonth}' AS period,
          (SELECT COUNT(*) FROM trasaction_detail WHERE DATE(payment_success_date) >= '${date.getFullYear()}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(
          2,
          "0"
        )}-01' AND DATE(payment_success_date) < '${nextMonth.getFullYear()}-${(
        nextMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-01') AS transactions,
          (SELECT SUM(trasaction_amount) FROM trasaction_detail WHERE DATE(payment_success_date) >= '${date.getFullYear()}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(
          2,
          "0"
        )}-01' AND DATE(payment_success_date) < '${nextMonth.getFullYear()}-${(
        nextMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-01') AS amount,
          (SELECT COUNT(*) FROM artist WHERE DATE(created_at) >= '${date.getFullYear()}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(
          2,
          "0"
        )}-01' AND DATE(created_at) < '${nextMonth.getFullYear()}-${(
        nextMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-01') AS registrations,
          (SELECT COUNT(DISTINCT artist_id) FROM trasaction_detail WHERE DATE(payment_success_date) >= '${date.getFullYear()}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(
          2,
          "0"
        )}-01' AND DATE(payment_success_date) < '${nextMonth.getFullYear()}-${(
        nextMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-01') AS conversion
      `);
      date.setMonth(date.getMonth() + 1);
    }

    // Reverse the month queries to ensure descending order
    monthQueries.reverse();

    // Add queries for today, yesterday, and the current month
    const todayQuery = `
      SELECT 
        'Today' AS period,
        (SELECT COUNT(*) FROM trasaction_detail WHERE DATE(payment_success_date) = CURRENT_DATE) AS transactions,
        (SELECT SUM(trasaction_amount) FROM trasaction_detail WHERE DATE(payment_success_date) = CURRENT_DATE) AS amount,
        (SELECT COUNT(*) FROM artist WHERE DATE(created_at) = CURRENT_DATE) AS registrations,
        (SELECT COUNT(DISTINCT artist_id) FROM trasaction_detail WHERE DATE(payment_success_date) = CURRENT_DATE) AS conversion
    `;

    const yesterdayQuery = `
      SELECT 
        'Yesterday' AS period,
        (SELECT COUNT(*) FROM trasaction_detail WHERE DATE(payment_success_date) = CURRENT_DATE - INTERVAL '1 day') AS transactions,
        (SELECT SUM(trasaction_amount) FROM trasaction_detail WHERE DATE(payment_success_date) = CURRENT_DATE - INTERVAL '1 day') AS amount,
        (SELECT COUNT(*) FROM artist WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day') AS registrations,
        (SELECT COUNT(DISTINCT artist_id) FROM trasaction_detail WHERE DATE(payment_success_date) = CURRENT_DATE - INTERVAL '1 day') AS conversion
    `;

    const currentMonthQuery = `
      SELECT 
        'Current Month' AS period,
        (SELECT COUNT(*) FROM trasaction_detail WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) AND DATE(payment_success_date) < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') AS transactions,
        (SELECT SUM(trasaction_amount) FROM trasaction_detail WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) AND DATE(payment_success_date) < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') AS amount,
        (SELECT COUNT(*) FROM artist WHERE DATE(created_at) >= date_trunc('month', CURRENT_DATE) AND DATE(created_at) < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') AS registrations,
        (SELECT COUNT(DISTINCT artist_id) FROM trasaction_detail WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) AND DATE(payment_success_date) < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') AS conversion
    `;

    const queries = [
      todayQuery,
      yesterdayQuery,
      currentMonthQuery,
      ...monthQueries,
    ];

    // Step 3: Execute all queries
    const allData = await Promise.all(
      queries.map(async (query) => {
        return new Promise((resolve, reject) => {
          pool.query(query, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.rows[0]);
            }
          });
        });
      })
    );

    // Step 4: Convert data to appropriate format
    const convertedData = allData.map((entry) => {
      const convertedEntry = {};
      for (const value in entry) {
        if (entry[value] === null) {
          convertedEntry[value] = 0;
        } else if (typeof entry[value] === "string" && value !== "period") {
          convertedEntry[value] = parseInt(entry[value], 10);
        } else {
          convertedEntry[value] = entry[value];
        }
      }
      return convertedEntry;
    });

    return res.status(200).send({
      success: true,
      message: "Transactions fetched successfully",
      statusCode: 200,
      data: convertedData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
