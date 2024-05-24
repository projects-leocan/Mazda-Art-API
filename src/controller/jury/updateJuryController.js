const pool = require("../../config/db");
const _ = require("lodash");
const { somethingWentWrong } = require("../../constants/messages");
const { passwordHashing } = require("../../constants/passwordHashing");
const { getJuryDetails } = require("./juryDetail");

exports.updateJuryDetailsController = async (req, res) => {
    const { jury_id, is_link_updated, fullName, email, contact_no, password, address, designation, DOB, about, links, isFirstTimeSignIn } = req.body;

    try {
        const currentTime = new Date().toISOString().slice(0, 10);

        let query = `UPDATE jury SET `;
        query += `updated_at='${currentTime}'`;

        if (fullName != undefined) {
            query += `, full_name='${fullName}'`;
        }
        if (email != undefined) {
            query += `, email='${email}'`;
        }
        if (contact_no != undefined) {
            query += `, contact_no='${contact_no}'`;
        }
        if (password != undefined) {
            const hashedPassword = await passwordHashing(password);
            query += `, password='${hashedPassword}'`;
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
        console.log(`query: ${query}`);

        pool.query(query, async (err, result) => {
            console.log(`err: ${err}`);
            console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        error: err,
                        messages: "Something went wrong",
                        statusCode: 500
                    }
                )
            } else {
                /// delete jury_links for jury_id from jury table 
                if (is_link_updated != undefined) {
                    const deleteQuery = `DELETE FROM jury_links WHERE jury_id = ${jury_id};`;
                    await pool.query(deleteQuery);

                    /// add links in jury_link table
                    if (links != undefined && !_.isEmpty(links)) {
                        let linkQuery = `INSERT INTO jury_links(jury_id, link) VALUES `;
                        const last = links[links.length - 1];
                        links.map((e) => {
                            if (e === last) {
                                linkQuery += `(${jury_id}, '${e}')`;
                            } else {
                                linkQuery += `(${jury_id}, '${e}'), `;
                            }
                        });
                        // console.log(`linkQuery: ${linkQuery}`);

                        // get latest inserted data
                        pool.query(linkQuery, async (linkError, linkResult) => {
                            // console.log(`err: ${err}`);
                            // console.log(`linkResult: ${JSON.stringify(linkResult)}`);
                            if (linkError) {
                                await getJuryDetails(jury_id, "Jury added success, failed to add links for Jury", res);
                            } else {
                                await getJuryDetails(jury_id, 'Jury Updated Successfully', res);
                            }
                        })
                    } else {
                        getJuryDetails(jury_id, 'Jury Updated Successfully', res);
                    }
                } else {
                    getJuryDetails(jury_id, 'Jury Updated Successfully', res);
                }
            }
        });
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