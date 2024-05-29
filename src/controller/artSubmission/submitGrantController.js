const pool = require("../../config/db");
const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const { getUTCdate } = require("../../constants/getUTCdate");
const { somethingWentWrong } = require("../../constants/messages");
const lodash = require("lodash");
const { fileUpload } = require("../../utils/fileUpload");
const formidable = require("formidable");
const { getGrantSubmittedDetails } = require("./getSubmitGrantDetail");

exports.submitGrantController = async (req, res) => {
    // console.log(`req.body: ${JSON.stringify()}`)
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            let {
                artist_id,
                grant_id,
                art_title,
                art_height,
                art_width,
                art_description,
                art_file_extension,
            } = fields;

            if (Object.keys(fields).length === 0) {
                res.status(500).send({
                    success: false,
                    message: "Pass data in body",
                    statusCode: 500,
                });
            }

            const transactionQuery = `SELECT * FROM public.trasaction_detail WHERE artist_id = ${artist_id} AND grant_id = ${grant_id}`;

            const transactionResult = await pool.query(transactionQuery);
            // console.log('transactionResult: ', transactionResult);

            if (
                !lodash.isEmpty(transactionResult.rows) &&
                transactionResult.rows[0].trasaction_status != undefined &&
                transactionResult.rows[0].trasaction_status === "SUCCESS"
            ) {
                // grant already submitted

                const grantAlreadySubmittedQuery = `SELECT * FROM submission_details WHERE artist_id = ${artist_id} AND grant_id = ${grant_id}`;
                const grantAlreadySubmittedResult = await pool.query(
                    grantAlreadySubmittedQuery
                );

                if (grantAlreadySubmittedResult.rowCount === 0) {
                    // transaction details
                    const transactionId = transactionResult.rows[0].trasaction_id;

                    // console.log('transactionId: ', transactionId);
                    // file upload for grant
                    const artFile = files["art_file"];
                    let artImageUploadError;
                    if (artFile != undefined) {
                        const artImagePath = artFile[0].filepath;
                        const filename =
                            artist_id + "_" + Date.now() + `.${art_file_extension}`;
                        const artFolderPath = artistGrantSubmissionFilesPath + filename;
                        try {
                            // console.log('filename: ', filename);
                            fileUpload(artImagePath, artFolderPath);
                        } catch (err) {
                            // console.log('file upload error: ', err);
                            artImageUploadError = err;
                        }
                        // const data = [artist_id, transactionId, grant_id, filename, art_title, art_height, art_width, art_description];
                        const query = `INSERT INTO public.submission_details(
                artist_id, transaction_id, grant_id, art_file, art_title, height, width, art_description)
                VALUES (${artist_id}, '${transactionId}', ${grant_id}, '${filename}', '${art_title}', ${art_height}, ${art_width}, '${art_description}') RETURNING id`;
                        pool.query(query, async (err, result) => {
                            console.log(`insert error: ${err}`);
                            if (err) {
                                // console.log(`insert error: ${err}`);
                                console.log(`insert result: ${result}`);
                                res.status(500).send({
                                    success: false,
                                    message: somethingWentWrong,
                                    statusCode: 500,
                                });
                            } else {
                                const submissionId = result.rows[0].id;
                                await getGrantSubmittedDetails(submissionId, "Grant submitted Successfully.", res, req);
                                /*const submissionDetailQuery = `SELECT * FROM submission_details WHERE id = ${submissionId}`;
                                pool.query(
                                    submissionDetailQuery,
                                    async (submissionDetailError, submissionDetailResult) => {
                                        if (submissionDetailError) {
                                            res.status(500).send({
                                                success: false,
                                                message: somethingWentWrong,
                                                statusCode: 500,
                                            });
                                        } else {
                                            res.status(200).send({
                                                success: true,
                                                message: "Grant submitted Successfully.",
                                                statusCode: 200,
                                                data: submissionDetailResult.rows[0],
                                            });
                                        }
                                    }
                                );*/
                            }
                        });
                    } else {
                        res.status(500).send({
                            success: false,
                            message: "Please add art file.",
                            statusCode: 500,
                        });
                    }
                } else {
                    await getGrantSubmittedDetails(grantAlreadySubmittedResult.rows[0].id, "Grant already submitted.", res);
                }
            } else {
                res.status(500).send({
                    success: false,
                    message: "Please add payment for this Grant first.",
                    statusCode: 500,
                });
            }
        });
    } catch (error) {
        console.log(`error: ${error}`);
        res.status(500).send({
            success: false,
            message: somethingWentWrong,
            statusCode: 500,
        });
    }
};
