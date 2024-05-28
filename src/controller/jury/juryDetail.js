const pool = require("../../config/db");
const { getUTCdate } = require("../../constants/getUTCdate");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");

exports.getJuryDetails = async (jury_id, message, res) => {
    // const newQuery = `SELECT jury.id, jury.*, array_agg(jury_links.link) AS links FROM jury LEFT JOIN jury_links ON jury.id = jury_links.jury_id
    //  WHERE jury_id = ${jury_id} GROUP BY jury.id`;
    const newQuery = `SELECT jury.*, array_agg(jury_links.link) AS links FROM jury LEFT JOIN jury_links ON jury.id = jury_links.jury_id WHERE jury.id = ${jury_id} GROUP BY jury.id;`;
    // const newQuery = `SELECT * FROM jury WHERE id = ${jury_id}`; //1716444879455
    try {
        pool.query(newQuery, async (newErr, newResult) => {
            // console.log(`getJuryDetails newResult: ${JSON.stringify(newResult)}`);
            // console.log(`newErr: ${newErr}`);
            if (newErr) {
                res.status(500).send(
                    {
                        success: false,
                        messages: "Something went wrong",
                        statusCode: 500,
                    }
                )
            } else {
                if (_.isEmpty(newResult.rows)) {
                    return res.status(500).send(
                        {
                            success: false,
                            message: "Jury not found.",
                            statusCode: 500
                        }
                    )
                } else {
                    const grantQuery = `SELECT ga.jury_id, g.* FROM public.grant_assign as ga,grants as g WHERE ga.grant_id = g.grant_id AND jury_id = ${jury_id}`
                    const juryGrantsResult = await pool.query(grantQuery);
                    const grants = [];

                    if (juryGrantsResult.rowCount > 0) {
                        juryGrantsResult.rows.map((e) => {
                            e.submission_end_date = getUTCdate(e.submission_end_date)
                            e.updated_at = getUTCdate(e.updated_at)
                            grants.push(e);
                        })
                    }

                    /// remove data from map 
                    if (newResult.rows[0].password != undefined) delete newResult.rows[0].password;
                    if (newResult.rows[0].created_at != undefined) delete newResult.rows[0].created_at;
                    if (newResult.rows[0].updated_at != undefined) delete newResult.rows[0].updated_at;
                    if (Array.isArray(newResult.rows[0].links) && newResult.rows[0].links.length === 1 && newResult.rows[0].links[0] === null) {
                        delete newResult.rows[0].links;
                    }
                    const response = {
                        ...newResult.rows[0],
                        dob: getUTCdate(newResult.rows[0].dob),
                        assignGrants: juryGrantsResult.rows,
                    }
                    return res.status(200).send(
                        {
                            success: true,
                            statusCode: 200,
                            message: message,
                            data: response,
                        }
                    );
                }
            }
        })
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