// const pool = require("../../config/db");
// const lodash = require("lodash");
// const {
//   userPortFoliaImagePath,
//   userProfileImagePath,
//   getFileURLPreFixPath,
//   artistGrantSubmissionFilesPath,
// } = require("../../constants/filePaths");
// const { somethingWentWrong } = require("../../constants/messages");
// const { getUTCdate } = require("../../constants/getUTCdate");

// exports.getArtistDetails = async (artist_id, message, res, req) => {
//   // console.log("props artist", req)
//   try {
//     // const query = `SELECT * FROM artist WHERE artist_id = ${user_id}`;
//     // const query = `SELECT
//     //         artist.*,
//     //         ARRAY_AGG(artist_moc.moc_id) AS artist_moc
//     //     FROM artist
//     //     LEFT JOIN artist_moc ON artist.artist_id = artist_moc.artist_id
//     //     WHERE artist.artist_id = ${artist_id}
//     //     GROUP BY artist.artist_id`;

//     const query = `SELECT artist.*,
//                   ARRAY_AGG(DISTINCT artist_moc.moc_id) AS artist_moc,
//                   ARRAY_AGG(
//                     JSON_BUILD_OBJECT(
//                       'transaction_id', trasaction_detail.trasaction_id,
//                       'payment_success_date', trasaction_detail.payment_success_date,
//                       'transaction_amount', trasaction_detail.trasaction_amount,
//                       'grant_id',trasaction_detail.grant_id
//                     )
//                   ) AS transactions
//                   FROM artist
//                   LEFT JOIN artist_moc ON artist.artist_id = artist_moc.artist_id
//                   LEFT JOIN trasaction_detail ON artist.artist_id = trasaction_detail.artist_id
//                   WHERE artist.artist_id = ${artist_id}
//                   GROUP BY artist.artist_id;
//                   `;

//     pool.query(query, async (err, result) => {
//       // console.log("error", err);

//       if (err) {
//         return res.status(500).send({
//           success: false,
//           message: err,
//           statusCode: 500,
//         });
//       } else {
//         if (result.rowCount === 0) {
//           return res.status(500).send({
//             success: false,
//             message: "User not found.",
//             statusCode: 500,
//           });
//         } else {
//           const artistPortfolioImageQuery = `SELECT artist_portfolio FROM artist_portfolio WHERE artist_id=${result.rows[0].artist_id}`;
//           const artistPortfolioImage = await pool.query(
//             artistPortfolioImageQuery
//           );
//           console.log(
//             "artist portfolio",
//             artistPortfolioImage.rows[0]?.artist_portfolio
//           );

//           const prePath = getFileURLPreFixPath(req);
//           // if (result.rows[0].artist_portfolio != null) {
//           //   result.rows[0].artist_portfolio = `${prePath}${userPortFoliaImagePath}${result.rows[0].artist_portfolio}`;
//           // }
//           if (artistPortfolioImage.rows[0]?.artist_portfolio != null) {
//             result.rows[0].artist_portfolio = `${prePath}${userPortFoliaImagePath}${artistPortfolioImage.rows[0]?.artist_portfolio}`;
//           }
//           if (result.rows[0].profile_pic != null) {
//             result.rows[0].profile_pic = `${prePath}${userProfileImagePath}${result.rows[0].profile_pic}`;
//           }

//           let data = await Promise.all([
//             !lodash.isEmpty(result.rows[0].artist_moc) &&
//             result.rows[0].artist_moc != [null]
//               ? (mocData = await getMocData(result.rows[0].artist_moc))
//               : [],
//             await getGrantsData(artist_id, req),
//             await getArtistComments(artist_id),
//           ]);

//           delete result.rows[0].artist_moc;
//           let finalResult = {
//             ...result.rows[0],
//             mocs: data[0][0] === undefined ? [] : data[0],
//             grants: data[1],
//             comments: data[2],
//           };

//           const updatedGrants = finalResult?.grants?.map((grant) => {
//             // Find corresponding transaction
//             const transaction = finalResult?.transactions.find(
//               (tran) => tran.grant_id === +grant.grant_id
//             );

//             // If transaction found, add it to the grant object
//             if (transaction) {
//               return { ...grant, transaction };
//             } else {
//               return grant;
//             }
//           });

//           finalResult = {
//             ...finalResult,
//             grants: updatedGrants,
//           };

//           delete finalResult?.transactions;

//           if (finalResult?.grants?.length > 0) {
//             const grantQuery = `SELECT grant_uid FROM grants where grant_id=${+finalResult
//               .grants[0].grant_id}`;
//             const grantQueryResult = await pool.query(grantQuery);
//           }

//           return res.status(200).send({
//             success: true,
//             message: message,
//             // data: result.rows,
//             data: finalResult,
//             statusCode: 200,
//           });
//         }
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

// const getGrantsData = async (artist_id, req) => {
//   const submitted_grant_data = await pool.query(
//     `SELECT * FROM submission_details WHERE artist_id=${artist_id}`
//   );
//   // console.log("submitted_grant_data: ", JSON.stringify(submitted_grant_data));
//   if (!lodash.isEmpty(submitted_grant_data.rows)) {
//     const prePath = getFileURLPreFixPath(req);
//     submitted_grant_data.rows.map((e) => {
//       delete e.transaction_id,
//         delete e.jury_id,
//         (e.art_file = `${prePath}${artistGrantSubmissionFilesPath}${e.art_file}`);
//     });
//   }
//   return submitted_grant_data.rows;
// };

// const getMocData = async (list) => {
//   return await Promise.all(
//     list.map(async (e) => {
//       const mocResult = await pool.query(
//         `SELECT id, medium_of_choice FROM medium_of_choice where id = ${e}`
//       );
//       return mocResult.rows[0];
//     })
//   );
// };
// const getArtistComments = async (artist_id) => {
//   // const comments_data = await pool.query(`SELECT * FROM artist_comments WHERE artist_id=${artist_id} LIMIT 10 OFFSET 0`)
//   const comments_data = await pool.query(
//     `SELECT ac.*, a.admin_name FROM artist_comments as ac JOIN admin a ON a.admin_id = ac.admin_id WHERE artist_id = ${artist_id} LIMIT 10 OFFSET 0`
//   );
//   // console.log('comments_data: ', JSON.stringify(comments_data));
//   if (!lodash.isEmpty(comments_data.rows)) {
//     comments_data.rows.map((e) => {
//       e.created_at = getUTCdate(e.created_at);
//     });
//   }
//   return comments_data.rows;
// };

const pool = require("../../config/db");
const lodash = require("lodash");
const {
  userPortFoliaImagePath,
  userProfileImagePath,
  artistGrantSubmissionFilesPath,
  artistPortFoliaImagePath,
  artistProfileImagePath,
} = require("../../constants/filePaths");
const { somethingWentWrong } = require("../../constants/messages");
const { getUTCdate } = require("../../constants/getUTCdate");
const {
  getFileURLPreFixPath,
} = require("../../constants/getFileURLPreFixPath");

exports.getArtistDetails = async (artist_id, message, res, req) => {
  try {
    const query = `
      SELECT 
        artist.*, 
        ARRAY_AGG(DISTINCT artist_moc.moc_id) AS artist_moc,
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
                       'transaction_id', trasaction_detail.trasaction_id,
                       'payment_success_date', trasaction_detail.payment_success_date,
                       'transaction_amount', trasaction_detail.trasaction_amount,
                       'grant_id',trasaction_detail.grant_id
                     )
                   ) AS transactions
      FROM artist
      LEFT JOIN artist_moc ON artist.artist_id = artist_moc.artist_id
      LEFT JOIN trasaction_detail ON artist.artist_id = trasaction_detail.artist_id
      WHERE artist.artist_id = $1
      GROUP BY artist.artist_id;
    `;
    // console.log("query", query);
    const artistResult = await pool.query(query, [artist_id]);

    if (artistResult.rowCount === 0) {
      return res.status(500).send({
        success: false,
        message: "User not found.",
        statusCode: 500,
      });
    } else {
      const artistPortfolioImageQuery = `SELECT artist_portfolio FROM artist_portfolio WHERE artist_id = $1`;
      const artistConversionDateQuery = `SELECT MIN(payment_success_date) AS conversion FROM trasaction_detail WHERE artist_id = $1;`;
      const adminDetailQuery = `SELECT * FROM admin WHERE admin_id=${artistResult?.rows[0]?.last_updated_by}`;

      const artistPortfolioImage = await pool.query(artistPortfolioImageQuery, [
        artist_id,
      ]);

      const artistConversionDate = await pool.query(artistConversionDateQuery, [
        artist_id,
      ]);

      const adminDetail = await pool.query(adminDetailQuery);

      const prePath = getFileURLPreFixPath(req);
      const artistData = artistResult.rows[0];

      if (artistPortfolioImage.rows[0]?.artist_portfolio) {
        artistData.artist_portfolio = `${prePath}${artistPortFoliaImagePath}${artistPortfolioImage.rows[0].artist_portfolio}`;
      }
      artistData.last_updated_by = adminDetail?.rows[0]?.admin_name;
      artistData.artist_portfolios = artistPortfolioImage.rows.map((row) => {
        return `${prePath}${artistPortFoliaImagePath}${row.artist_portfolio}`;
      });
      if (artistData.profile_pic) {
        artistData.profile_pic = `${prePath}${artistProfileImagePath}${artistData.profile_pic}`;
      }
      // console.log("artst data", artistData);
      const [mocs, grants, comments, transactions] = await Promise.all([
        !lodash.isEmpty(artistData.artist_moc) &&
        artistData.artist_moc[0] != null
          ? getMocData(artistData.artist_moc)
          : [],
        getGrantsData(artist_id, req),
        getArtistComments(artist_id),
        getTransactionData(artist_id),
      ]);

      delete artistData.artist_moc;

      let finalResult = {
        ...artistData,
        mocs,
        grants,
        comments,
        transactions,
        conversionDate: artistConversionDate?.rows[0]?.conversion,
      };

      finalResult.grants = finalResult.grants.map((grant) => {
        const transaction = finalResult.transactions.find(
          (tran) => tran.grant_id === +grant.grant_id
        );
        return transaction ? { ...grant, transaction } : grant;
      });

      // delete finalResult.transactions;

      if (finalResult.grants.length > 0) {
        const grantQuery = `SELECT grant_uid FROM grants WHERE grant_id = $1`;
        const grantQueryResult = await pool.query(grantQuery, [
          +finalResult.grants[0].grant_id,
        ]);
      }
      return res.status(200).send({
        success: true,
        message: message,
        data: finalResult,
        statusCode: 200,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};

const getGrantsData = async (artist_id, req) => {
  // const submittedGrantData = await pool.query(
  //   `SELECT * FROM submission_details WHERE artist_id = $1`,
  //   [artist_id]
  // );

  // if (!lodash.isEmpty(submittedGrantData.rows)) {
  //   const prePath = getFileURLPreFixPath(req);
  //   submittedGrantData.rows.forEach((e) => {
  //     delete e.transaction_id;
  //     delete e.jury_id;
  //     e.art_file = `${prePath}${artistGrantSubmissionFilesPath}${e.art_file}`;
  //   });
  // }
  try {
    // Fetch submitted grant data
    // const submitted_grant_data = await pool.query(
    //   `SELECT * FROM submission_details WHERE artist_id=${artist_id}`
    // );

    const submitted_grant_data = await pool.query(
      `SELECT sd.*, sar.status AS admin_review_status 
        FROM 
            submission_details sd
        LEFT JOIN 
            submission_admin_review sar 
        ON 
            sd.id = sar.artwork_id 
        WHERE 
            sd.artist_id = ${artist_id} ORDER BY sd.id DESC;`
    );

    if (!lodash.isEmpty(submitted_grant_data.rows)) {
      const prePath = getFileURLPreFixPath(req);

      submitted_grant_data.rows.map((row) => {
        delete row.artwork_id;
        row.artwork_id = row.id;
      });

      const grantUIDPromises = submitted_grant_data.rows.map(async (e) => {
        // Fetch grant_uid for the current grant_id
        const grantData = await pool.query(
          `SELECT grant_uid FROM grants WHERE grant_id=${e.grant_id}`
        );
        // Check if grantData has rows and assign grant_uid
        if (!lodash.isEmpty(grantData.rows)) {
          e.grant_uid = grantData.rows[0].grant_uid; // Append the grant_uid to the current row
        }

        // Modify the art_file path and delete unnecessary properties
        delete e.transaction_id;
        delete e.jury_id;
        e.art_file = `${prePath}${artistGrantSubmissionFilesPath}${e.art_file}`;
        return e;
      });

      // Wait for all the promises to resolve
      await Promise.all(grantUIDPromises);
    }

    return submitted_grant_data.rows;
  } catch (error) {
    console.error("Error in getGrantsData: ", error);
    throw error;
  }
  return submittedGrantData.rows;
};

const getMocData = async (list) => {
  return await Promise.all(
    list.map(async (e) => {
      const mocResult = await pool.query(
        `SELECT id, medium_of_choice FROM medium_of_choice WHERE id = $1`,
        [e]
      );
      return mocResult.rows[0];
    })
  );
};

const getTransactionData = async (artist_id) => {
  const transactionResultQuery = await pool.query(
    `SELECT 
  td.trasaction_id, 
  td.trasaction_amount, 
  td.trasaction_status, 
  td.payment_init_date, 
  td.payment_success_date, 
  td.no_of_submission, 
  g.grant_uid
FROM 
  trasaction_detail td
JOIN 
  grants g 
  ON g.grant_id = td.grant_id
WHERE 
  td.artist_id = ${artist_id}
ORDER BY 
  td.trasaction_id DESC;
`
  );
  return transactionResultQuery.rows;
};

const getArtistComments = async (artist_id) => {
  const commentsData = await pool.query(
    `SELECT ac.*, a.admin_name 
     FROM artist_comments AS ac 
     JOIN admin AS a ON a.admin_id = ac.admin_id 
     WHERE artist_id = $1 
     LIMIT 10 OFFSET 0`,
    [artist_id]
  );

  if (!lodash.isEmpty(commentsData.rows)) {
    commentsData.rows.forEach((e) => {
      e.created_at = getUTCdate(e.created_at);
    });
  }
  return commentsData.rows;
};
