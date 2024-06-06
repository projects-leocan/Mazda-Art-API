const pool = require("../../config/db");
const _ = require("lodash");
const { passwordHashing } = require("../../constants/passwordHashing");
const { getJuryDetails } = require("./juryDetail");
const { somethingWentWrong } = require("../../constants/messages");

exports.addJuryController = async (req, res) => {
  const {
    fullName,
    email,
    contact_no,
    password,
    address,
    designation,
    DOB,
    about,
    links,
  } = req.body;

  try {
    const currentTime = new Date().toISOString().slice(0, 10);
    // const id = new Date().getTime();

    const hashedPassword = await passwordHashing(password);

    const query = `INSERT INTO jury(
            full_name, email, contact_no, password, address, designation, dob, about, created_at, updated_at)
            VALUES ('${fullName}', '${email}', ${contact_no}, '${hashedPassword}', '${address}', '${designation}', '${DOB}', '${about}', '${currentTime}', '${currentTime}') RETURNING id`;

    pool.query(query, async (err, result) => {
      // console.log(`query: ${query}`);
      // console.log(`result: ${JSON.stringify(result)}`);
      if (err) {
        console.log(`err: ${err}`);
        if (err.detail === `Key (email)=(${email}) already exists.`) {
          res.status(500).send({
            success: false,
            messages: "Email Id already Exist, try different email or sign in.",
            statusCode: 500,
          });
        } else {
          console.log(`err: ${err}`);
          res.status(500).send({
            success: false,
            messages: somethingWentWrong,
            statusCode: 500,
          });
        }
      } else {
        if (!_.isEmpty(links)) {
          // add links in link master table
          let linkQuery = `INSERT INTO jury_links(jury_id, link) VALUES `;
          const last = links[links.length - 1];
          links.map((e) => {
            if (e === last) {
              linkQuery += `(${result.rows[0].id}, '${e}')`;
            } else {
              linkQuery += `(${result.rows[0].id}, '${e}'), `;
            }
          });
          // console.log(`linkQuery: ${linkQuery}`);

          // get latest inserted data
          pool.query(linkQuery, async (linkError, linkResult) => {
            // console.log(`err: ${err}`);
            // console.log(`linkResult: ${JSON.stringify(linkResult)}`);
            if (linkError) {
              await getJuryDetails(
                linkResult.rows[0].id,
                "Jury added success, failed to add links for Jury",
                res
              );
            } else {
              await getJuryDetails(
                result.rows[0].id,
                "Jury Inserted Successfully",
                res
              );
            }
          });
        } else {
          getJuryDetails(result.rows[0].id, "Jury Inserted Successfully", res);
        }
      }
    });
  } catch (error) {
    console.log(`error: ${error}`);
    return res.status(500).send({
      success: false,
      message: somethingWentWrong,
      statusCode: 500,
    });
  }
};
