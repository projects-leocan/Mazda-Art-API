const pool = require("../../config/db");
const lodash = require('lodash');
const { somethingWentWrong } = require("../../constants/messages");
const { getFileURLPreFixPath, artistGrantSubmissionFilesPath } = require("../../constants/filePaths");

exports.getGrantJuryMappingController = async (req, res) => {
    let { record_per_page, page_no, isAll, admin_id } = req.query;

    try {
        if (record_per_page == undefined) {
            record_per_page = 10;
        }
        if (page_no == undefined) {
            page_no = 1;
        }

        let query = `SELECT ga.grant_id, ga.assign_by,j.id as jury_id, j.email, j.full_name, j.contact_no FROM grant_assign as ga JOIN jury j ON j.id = ga.jury_id ORDER BY ga.created_at`;

        if (isAll == undefined) {
            offset = (page_no - 1) * record_per_page;
            query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
        }

        pool.query(query, async (err, result) => {
            console.log(`err: ${err}`);
            console.log(`result: ${result}`);
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        message: err,
                        statusCode: 500
                    }
                );
            } else {
                res.status(200).send(
                    {
                        success: true,
                        statusCode: 200,
                        message: "Grant-Jury-Mapping get successfully.",
                        data: result.rows,
                    }
                );
            }
        });
    } catch (error) {
        console.log(`error: ${error}`);
        res.status(500).send(
            {
                success: false,
                message: err,
                statusCode: 500
            }
        );
    }

}