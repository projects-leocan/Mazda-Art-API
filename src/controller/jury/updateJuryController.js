const bcrypt = require("bcrypt");
const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { passwordHashing } = require("../../constants/passwordHashing");
const { getJuryDetails } = require("./juryDetail");

exports.updateJuryDetailsController = async (req, res) => {
  const {
    jury_id,
    is_link_updated,
    full_name,
    email,
    contact_no,
    password,
    address,
    designation,
    DOB,
    about,
    links,
    isFirstTimeSignIn,
  } = req.body;

  try {
    const currentTime = new Date().toISOString().slice(0, 10);

    let query = `UPDATE jury SET updated_at='${currentTime}'`;

    if (full_name != undefined) {
      query += `, full_name='${full_name}'`;
    }
    if (email != undefined) {
      query += `, email='${email}'`;
    }
    if (contact_no != undefined) {
      const checkQuery = `SELECT * FROM jury WHERE contact_no = $1`;
      const values = [contact_no];
      const contactUsResult = await pool.query(checkQuery, values);

      if (contactUsResult.rows.length > 0) {
        return res.status(400).send({
          success: false,
          message: "Contact number already exists, try a different number.",
          statusCode: 400,
        });
      } else {
        query += `, contact_no='${contact_no}'`;
      }
    }
    // if (password != undefined) {
    //   // Fetch the current password hash from the database
    //   const fetchPasswordQuery = `SELECT password FROM jury WHERE id = ${jury_id}`;

    //   const currentPasswordHashResult = await pool.query(fetchPasswordQuery);

    //   if (currentPasswordHashResult.rows.length > 0) {
    //     const currentPasswordHash = currentPasswordHashResult.rows[0].password;
    //     const isSamePassword = await bcrypt.compare(
    //       password,
    //       currentPasswordHash
    //     );

    //     const isCorrectCurrentPassword = await bcrypt.compare(
    //       currentPassword,
    //       currentPasswordHash
    //     );

    //     if (isSamePassword) {
    //       return res.status(400).send({
    //         success: false,
    //         message: "You cannot set the current password as the new password.",
    //         statusCode: 400,
    //       });
    //     } else {
    //       if (isCorrectCurrentPassword) {
    //         const hashedPassword = await passwordHashing(password);
    //         query += `, password='${hashedPassword}'`;
    //       } else {
    //         return res.status(400).send({
    //           success: false,
    //           message: "Current Password is wrong",
    //           statusCode: 400,
    //         });
    //       }
    //       // Hash the new password
    //     }
    //   }
    // }
    if (password != undefined) {
      // Fetch the current password hash from the database
      const fetchPasswordQuery = `SELECT password FROM jury WHERE id = ${jury_id}`;
      const currentPasswordHashResult = await pool.query(fetchPasswordQuery);

      if (currentPasswordHashResult.rows.length > 0) {
        const currentPasswordHash = currentPasswordHashResult.rows[0].password;
        const isSamePassword = await bcrypt.compare(
          password,
          currentPasswordHash
        );

        if (isSamePassword) {
          return res.status(400).send({
            success: false,
            message: "You cannot set the current password as the new password.",
            statusCode: 400,
          });
        } else {
          // Hash the new password
          const hashedPassword = await passwordHashing(password);
          query += `, password='${hashedPassword}'`;
        }
      }
    }
    if (address != undefined) {
      query += `, address='${address}'`;
    }
    if (designation != undefined) {
      query += `, designation='${designation}'`;
    }
    if (DOB != undefined) {
      query += `, DOB='${DOB}'`;
    }
    if (about != undefined) {
      query += `, about='${about}'`;
    }
    if (isFirstTimeSignIn != undefined && isFirstTimeSignIn === true) {
      query += `, is_jury_password_updated=1`;
    }

    query += ` WHERE id = ${jury_id}`;

    // Run the update query
    await pool.query(query);

    // Proceed with link updates if required
    if (is_link_updated != undefined) {
      const deleteQuery = `DELETE FROM jury_links WHERE jury_id = ${jury_id}`;
      await pool.query(deleteQuery);

      if (links != undefined && !_.isEmpty(links)) {
        let linkQuery = `INSERT INTO jury_links(jury_id, link) VALUES `;
        links.forEach((link, index) => {
          linkQuery += `(${jury_id}, '${link}')${
            index < links.length - 1 ? ", " : ""
          }`;
        });

        await pool.query(linkQuery);
      }
    }

    // Send successful response
    getJuryDetails(jury_id, "Jury Updated Successfully", res);
  } catch (error) {
    // console.error(`error: ${error}`);
    if (!res.headersSent) {
      return res.status(500).send({
        success: false,
        message: somethingWentWrong,
        statusCode: 500,
      });
    }
  }
};
