const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const {
  getFileURLPreFixPath,
  artistGrantSubmissionFilesPath,
} = require("../../constants/filePaths");

exports.getGrantJuryMappingController = async (req, res) => {
  let { record_per_page, page_no, isAll, admin_id } = req.query;

  try {
    if (record_per_page == undefined) {
      record_per_page = 10;
    }
    if (page_no == undefined) {
      page_no = 1;
    }

    // let query = `SELECT g.grant_id,g.grant_uid, (SELECT COUNT(*) AS total_count FROM grants),
    //     COALESCE(ARRAY_AGG(ga.jury_id) FILTER (WHERE ga.jury_id IS NOT NULL), '{}') AS jury
    //     FROM grants AS g
    //     LEFT JOIN grant_assign AS ga ON g.grant_id = ga.grant_id
    //     GROUP BY g.grant_id ORDER BY g.grant_id DESC`;

    // if (isAll == undefined) {
    //   offset = (page_no - 1) * record_per_page;
    //   query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    // }

    let query = `
  SELECT 
    g.grant_id,
    g.grant_uid,
    COUNT(*) OVER() AS total_count,
    COALESCE(ARRAY_AGG(ga.jury_id) FILTER (WHERE ga.jury_id IS NOT NULL), '{}') AS jury
  FROM 
    grants AS g
  LEFT JOIN 
    grant_assign AS ga ON g.grant_id = ga.grant_id
  WHERE 
    ga.jury_id IS NOT NULL
  GROUP BY 
    g.grant_id 
  ORDER BY 
    g.grant_id DESC
`;

    if (!isAll) {
      const offset = (page_no - 1) * record_per_page;
      query += ` LIMIT ${record_per_page} OFFSET ${offset}`;
    }

    pool.query(query, async (err, result) => {
      // console.log(`err: ${err}`);
      //   console.log(`result:::: ${JSON.stringify(result.rows)}`);
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        if (lodash.isEmpty(result.rows)) {
          res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Grant-Jury-Mapping get successfully.",
            data: result.rows,
          });
        } else {
          let juryIds = [];
          result.rows.map((e) => {
            if (!lodash.isEmpty(e.jury)) {
              // console.log("e.jury: ", e.jury);
              return e.jury.map((a) => juryIds.push(a));
            }
          });
          // console.log(`juryIds: ${juryIds}`);

          let uniqueIds = [...new Set(juryIds)];
          // console.log(`uniqueIds: ${uniqueIds}`);

          const juriesData = await Promise.all(
            uniqueIds.map(async (e) => {
              if (!lodash.isEmpty(e)) {
                return new Promise((resolve, reject) => {
                  const juryQuery = `SELECT id, full_name, email, contact_no, designation, is_jury_password_updated FROM jury WHERE id = ${e}`;
                  // console.log("juryQuery: ", juryQuery);
                  pool.query(juryQuery, (err, response) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(response.rows[0]);
                    }
                  });
                });
              }
            })
          );
          // console.log(`juriesData: ${JSON.stringify(juriesData)}`);

          const count = result.rows[0].total_count;
          result.rows.map((e) => {
            if (e.total_count != undefined) delete e.total_count;
          });
          const finalResponse = result.rows.map((e) => {
            return {
              ...e,
              jury: lodash.isEmpty(e.jury)
                ? []
                : e.jury.map((id) => {
                    return juriesData.find((x) => x?.id === id);
                  }),
            };
          });

          res.status(200).send({
            success: true,
            statusCode: 200,
            message: "Grant-Jury-Mapping get successfully.",
            data: finalResponse,
            total_count: count,
          });
        }
      }
    });
  } catch (error) {
    // console.log(`error: ${error}`);
    res.status(500).send({
      success: false,
      message: err,
      statusCode: 500,
    });
  }
};
