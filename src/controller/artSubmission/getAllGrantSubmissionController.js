const pool = require("../../config/db");
const { artistGrantSubmissionFilesPath } = require("../../constants/filePaths");
const {
  getFileURLPreFixPath,
} = require("../../constants/getFileURLPreFixPath");
const { somethingWentWrong } = require("../../constants/messages");

exports.getAllGrantSubmissionController = async (req, res) => {
  try {
    let { jury_id, admin_id, record_per_page, page_no, isAll, status } =
      req.query;
    if (record_per_page == undefined) {
      record_per_page = 10;
    }
    if (page_no == undefined) {
      page_no = 1;
    }
    // let query = `SELECT DISTINCT on (grant_id) * FROM submission_details`;
    let query =
      jury_id === undefined
        ? status === "undefined" || status === undefined
          ? `SELECT (SELECT COUNT(*) FROM submission_details) AS total_count, g.grant_uid, sd.id as artwork_id, sd.artist_id, sd.grant_id, sd.submited_time, sd.art_file, sd.art_title, sd.art_description, sd.height, sd.width, sd.status, td.trasaction_id, a.*
        FROM submission_details as sd
        JOIN grants g ON sd.grant_id = g.grant_id
        JOIN artist a ON sd.artist_id = a.artist_id 
        JOIN trasaction_detail AS td ON sd.transaction_id::bigint = td.id
        order by sd.submited_time DESC`
          : `SELECT (SELECT COUNT(*) 
        FROM submission_details sd
        JOIN submission_admin_review sar ON sd.id = sar.artwork_id
        JOIN grants g ON sd.grant_id = g.grant_id
        JOIN artist a ON sd.artist_id = a.artist_id
        WHERE sar.status = ${status}) AS total_count, 
       sar.artwork_id, sd.art_description, sd.art_file, sd.art_title, 
       sd.artist_id, sd.height, sd.width, sd.submited_time, 
       sar.status, g.grant_id, g.grant_uid, td.trasaction_id, 
       a.*
FROM submission_details sd
JOIN submission_admin_review sar ON sd.id = sar.artwork_id
JOIN grants g ON sd.grant_id = g.grant_id
JOIN artist a ON sd.artist_id = a.artist_id
JOIN 
    trasaction_detail AS td ON sd.transaction_id::bigint = td.id
WHERE sar.status = ${status}
ORDER BY sd.submited_time DESC`
        : //           `SELECT (SELECT COUNT(*) FROM submission_details) AS total_count, g.grant_uid, g.grant_id, sd.id as artwork_id, sd.art_title, sd.height, sd.width, sd.submited_time, srd.status
          // FROM submission_details sd
          // JOIN grants g ON sd.grant_id = g.grant_id
          // JOIN submission_review_details srd ON sd.id = srd.artwork_id
          // WHERE sd.grant_id IN (
          //     SELECT grant_id
          //     FROM grant_assign
          //     WHERE jury_id = ${jury_id}
          // )
          // AND srd.jury_id = ${jury_id}
          // order by g.grant_id DESC`;
          //           `SELECT
          //     (SELECT COUNT(*) FROM submission_details) AS total_count,
          //     g.grant_uid,
          //     sd.artwork_id,
          //     sd.art_title,
          //     sd.height,
          //     sd.width,
          //     sd.submited_time,
          //     srd.status
          // FROM
          //     submission_details sd
          // JOIN
          //     grants g ON sd.grant_id = g.grant_id
          // LEFT JOIN
          //     submission_review_details srd ON sd.artwork_id = srd.artwork_id
          // WHERE
          //     sd.grant_id IN
          //     (SELECT grant_id FROM grant_assign WHERE jury_id = ${jury_id})
          // order by g.grant_id DESC
          // `;
          `SELECT 
    (SELECT COUNT(*) FROM submission_details WHERE 
    grant_id IN (SELECT grant_id FROM grant_assign WHERE jury_id = ${jury_id})) AS total_count, 
    g.grant_uid, 
    sd.id as artwork_id, 
    sd.art_title, 
    sd.height, 
    sd.art_description,
    sd.width, 
    sd.jury_id,
    sd.submited_time, 
    srd.status
FROM 
    submission_details sd
JOIN 
    grants g ON sd.grant_id = g.grant_id  
LEFT JOIN 
    submission_review_details srd 
    ON sd.id = srd.artwork_id AND srd.jury_id = ${jury_id}
WHERE 
    sd.grant_id IN (SELECT grant_id FROM grant_assign WHERE jury_id = ${jury_id}) 
ORDER BY 
    sd.submited_time DESC
`;
    if (isAll == undefined) {
      const offset = (page_no - 1) * record_per_page;
      query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    }

    console.log("get all scrubbing queyr------------", query);

    pool.query(query, async (err, result) => {
      // console.log("err: ", err);
      // console.log("result: ", result.rows);
      if (err) {
        res.status(500).send({
          success: false,
          message: somethingWentWrong,
          statusCode: 500,
        });
      } else {
        const prePath = getFileURLPreFixPath(req);

        const count = result?.rows[0]?.total_count;
        result.rows.map((e) => {
          delete e.total_count;
        });
        result.rows.map((row) => {
          row.art_file = `${prePath}${artistGrantSubmissionFilesPath}/${row.art_file}`;
        });
        // const final_result = {
        //   ...result.rows,
        //   art_file:
        //     prePath + artistGrantSubmissionFilesPath + result.rows.art_file,
        // };
        res.status(200).send({
          success: true,
          message: "Get all submissions Successfully.",
          statusCode: 200,
          submission_count: count,
          data: result.rows,
        });
      }
    });
  } catch (error) {
    // console.log(`error: ${error}`);
    res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
