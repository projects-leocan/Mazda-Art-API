const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");

exports.getTransactionStatsController = async (req, res) => {
    const { admin_id } = req.query;
    try {

        const getTodaysTrasactionQuery = `SELECT 
        (SELECT COUNT(*) 
         FROM trasaction_detail 
         WHERE DATE(payment_success_date) = CURRENT_DATE) AS today_transaction,
        (SELECT SUM(trasaction_amount) 
         FROM trasaction_detail 
         WHERE DATE(payment_success_date) = CURRENT_DATE) AS amount,
        (SELECT COUNT(*) 
         FROM artist WHERE DATE(created_at) = CURRENT_DATE) AS registration;`;

        const getYesterdayData = `SELECT
        (SELECT COUNT(*) FROM trasaction_detail WHERE DATE(payment_success_date) = CURRENT_DATE - INTERVAL '1 day') as yesterdays_transactions,
        (SELECT SUM(trasaction_amount) FROM trasaction_detail WHERE DATE(payment_success_date) = CURRENT_DATE - INTERVAL '1 day') as amount,
        (SELECT COUNT(*) 
         FROM artist WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day') AS registration;`;

        const getCurrentMonthData = `SELECT
        (SELECT COUNT(*)
        FROM trasaction_detail
        WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) AND
        DATE(payment_success_date) < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') as "current_month_transactions",
        (SELECT SUM(trasaction_amount) FROM trasaction_detail 
        WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) AND
        DATE(payment_success_date) < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') as amount,
        (SELECT COUNT(*) 
         FROM artist WHERE DATE(created_at) >= date_trunc('month', CURRENT_DATE) AND
        DATE(created_at) < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month') AS registration;`;


        const getLastMonthData = `SELECT
        (SELECT COUNT(*)
        FROM trasaction_detail
        WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
        AND DATE(payment_success_date) < date_trunc('month', CURRENT_DATE)) as "last_month_transactions",
        (SELECT SUM(trasaction_amount) FROM trasaction_detail 
        WHERE DATE(payment_success_date) >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
        AND DATE(payment_success_date) < date_trunc('month', CURRENT_DATE)) as amount,
        (SELECT COUNT(*) 
        FROM artist WHERE DATE(created_at) >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
        AND DATE(created_at) < date_trunc('month', CURRENT_DATE)) as registration;`;

        const getCurrentYearData = `SELECT
        (SELECT COUNT(*)
        FROM trasaction_detail
        WHERE DATE(payment_success_date) >= date_trunc('year', CURRENT_DATE)
        AND DATE(payment_success_date) < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year') as "current_year_transactions",
        (SELECT SUM(trasaction_amount) FROM trasaction_detail 
        WHERE DATE(payment_success_date) >= date_trunc('year', CURRENT_DATE)
        AND DATE(payment_success_date) < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year') as amount,
        (SELECT COUNT(*) 
        FROM artist WHERE DATE(created_at) >= date_trunc('year', CURRENT_DATE)
        AND DATE(created_at) < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year') as registration;`;

        const getLastYearData = `SELECT
        (SELECT COUNT(*)
        FROM trasaction_detail
        WHERE DATE(payment_success_date) >= date_trunc('year', CURRENT_DATE) - INTERVAL '1 year'
        AND DATE(payment_success_date) < date_trunc('year', CURRENT_DATE)) as "last_year_transactions",
        (SELECT SUM(trasaction_amount) FROM trasaction_detail 
        WHERE DATE(payment_success_date) >= date_trunc('year', CURRENT_DATE) - INTERVAL '1 year'
        AND DATE(payment_success_date) < date_trunc('year', CURRENT_DATE)) as amount,
        (SELECT COUNT(*) 
         FROM artist WHERE DATE(created_at) >= date_trunc('year', CURRENT_DATE) - INTERVAL '1 year'
        AND DATE(created_at) < date_trunc('year', CURRENT_DATE)) as registration;`;

        const queries = [
            getTodaysTrasactionQuery,
            getYesterdayData,
            getCurrentMonthData,
            getLastMonthData,
            getCurrentYearData,
            getLastYearData,
        ];
        const allData = await Promise.all(
            queries.map(async (e) => {
                return new Promise((resolve, reject) => {
                    pool.query(e, (err, response) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(response.rows[0]);
                        }
                    });
                })
            })
        );
        // console.log('allData: ', allData);

        // convert data string to int
        const convertedData = allData.map(entry => {
            const convertedEntry = {};
            for (const value in entry) {
                if (entry[value] === null) {
                    convertedEntry[value] = 0;
                } else if (typeof entry[value] === 'string') {
                    convertedEntry[value] = parseInt(entry[value], 10);
                } else {
                    convertedEntry[value] = entry[value];
                }
            }
            return convertedEntry;
        });

        return res.status(200).send(
            {
                success: true,
                message: "Transactions fetch Successfully",
                statusCode: 200,
                data: convertedData,
            }
        )


    } catch (error) {
        console.log(`error: ${error}`);
        return res.status(500).send(
            {
                success: false,
                message: somethingWentWrong,
                statusCode: 500
            }
        )
    }
}
