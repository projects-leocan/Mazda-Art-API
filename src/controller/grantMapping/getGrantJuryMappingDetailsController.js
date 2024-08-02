const pool = require("../../config/db");
const lodash = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const {
  getFileURLPreFixPath,
  artistGrantSubmissionFilesPath,
} = require("../../constants/filePaths");

exports.getGrantJuryMappingDetailsController = async (req, res) => {
  let { grant_id, admin_id } = req.query;

  try {
    let query = `SELECT j.id, j.full_name, j.email, j.contact_no, j.designation, ga.grant_uid, g.created_at as jury_onboard_date, g.grant_id, g.created_at FROM jury j, grant_assign g, grants ga
WHERE j.id = g.jury_id AND ga.grant_id = g.grant_id AND g.grant_id = ${grant_id}`;

    pool.query(query, async (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
          statusCode: 500,
        });
      } else {
        res.status(200).send({
          success: true,
          statusCode: 200,
          message: "Grant-Jury-Mapping get successfully.",
          data: result.rows,
        });
      }
    });

    // pool.query(query, async (err, result) => {
    //   // console.log(`err: ${err}`);
    //   console.log(`result:::: ${JSON.stringify(result.rows)}`);
    //   if (err) {
    //     res.status(500).send({
    //       success: false,
    //       message: err,
    //       statusCode: 500,
    //     });
    //   } else {
    //     if (lodash.isEmpty(result.rows)) {
    //       res.status(200).send({
    //         success: true,
    //         statusCode: 200,
    //         message: "Grant-Jury-Mapping get successfully.",
    //         data: result.rows,
    //       });
    //     } else {
    //       let juryIds = [];
    //       result.rows.map((e) => {
    //         if (!lodash.isEmpty(e.jury)) {
    //           // console.log("e.jury: ", e.jury);
    //           return e.jury.map((a) => juryIds.push(a));
    //         }
    //       });
    //       // console.log(`juryIds: ${juryIds}`);

    //       let uniqueIds = [...new Set(juryIds)];
    //       // console.log(`uniqueIds: ${uniqueIds}`);

    //       const juriesData = await Promise.all(
    //         uniqueIds.map(async (e) => {
    //           if (!lodash.isEmpty(e)) {
    //             return new Promise((resolve, reject) => {
    //               const juryQuery = `SELECT id, full_name, email, contact_no, designation, is_jury_password_updated FROM jury WHERE id = ${e}`;
    //               //   console.log("juryQuery: ", juryQuery);
    //               pool.query(juryQuery, (err, response) => {
    //                 if (err) {
    //                   reject(err);
    //                 } else {
    //                   resolve(response.rows[0]);
    //                 }
    //               });
    //             });
    //           }
    //         })
    //       );
    //       // console.log(`juriesData: ${JSON.stringify(juriesData)}`);

    //       const count = result.rows[0].total_count;
    //       result.rows.map((e) => {
    //         if (e.total_count != undefined) delete e.total_count;
    //       });
    //       const finalResponse = result.rows.map((e) => {
    //         return {
    //           ...e,
    //           jury: lodash.isEmpty(e.jury)
    //             ? []
    //             : e.jury.map((id) => {
    //                 return juriesData.find((x) => x?.id === id);
    //               }),
    //         };
    //       });

    //       res.status(200).send({
    //         success: true,
    //         statusCode: 200,
    //         message: "Grant-Jury-Mapping get successfully.",
    //         data: finalResponse[0],
    //         total_count: count,
    //       });
    //     }
    //   }
    // });
  } catch (error) {
    // console.log(`error: ${error}`);
    res.status(500).send({
      success: false,
      message: err,
      statusCode: 500,
    });
  }
};
