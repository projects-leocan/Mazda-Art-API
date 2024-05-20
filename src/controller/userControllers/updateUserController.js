const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");
const formidable = require("formidable");
var util = require("util");
var fs = require("fs");
var path = require('path');
const { fileUpload } = require("../../utils/fileUpload");
const { userPortFoliaImagePath, userProfileImagePath } = require("../../constants/filePaths");
// const { handleFileUploads } = require("../../utils/fileUpload");


exports.updateUserController = async (req, res) => {

    console.log(`req.body: ${JSON.stringify()}`)
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            let { artist_id, fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_link, portfolio, profile_pic, MOC, is_profile_pic_updated, is_portfolio_updated } = fields;

            let query = `UPDATE artist set `;
            const portfolio_image = files['portfolio']
            const profile_image = files['profile_pic']

            let profileImageUploadError, portfolioImageUploadError;

            if (fname != undefined) {
                query += `fname='${fname}'`;
            }
            if (lname != undefined) {
                query += `, lname='${lname}'`;
            }
            if (dob != undefined) {
                query += `, dob=${dob}`;
            }
            if (gender != undefined) {
                query += `, gender='${gender}'`;
            }
            if (email != undefined) {
                query += `, email='${email}'`;
            }
            if (mobile_number != undefined) {
                query += `, mobile_number=${mobile_number}`;
            }
            if (address1 != undefined) {
                query += `, address1='${address1}'`;
            }
            if (address2 != undefined) {
                query += `, address2='${address2}'`;
            }
            if (city != undefined) {
                query += `, city='${city}'`;
            }
            if (state != undefined) {
                state += `, state='${state}'`;
            }
            if (pincode != undefined) {
                query += `, pincode='${pincode}'`;
            }
            if (social_media_link != undefined) {
                query += `, social_media_profile_link='${social_media_link}'`;
            }


            if (is_portfolio_updated != undefined) {
                if (portfolio_image == null) {
                    const getFilesQuery = `SELECT artist_portfolio FROM artist WHERE artist_id=${artist_id}`;
                    pool.query(query, async (error, result) => {
                        console.log(`sub-query result: ${JSON.stringify(result)}`);
                        console.log(`sub-query error: ${JSON.stringify(error)}`);
                        if (result.rowCount[0].artist_portfolio != null) {
                            fs.promises.unlink(result.rowCount[0].artist_portfolio);
                            query += `, artist_portfolio='${"null"}'`
                        }
                    });
                } else {
                    const portfolioImagePath = portfolio_image[0].filepath;
                    const filename = artist_id + "." + profile_image[0].originalFilename.split(".").pop();
                    const portfolioFolderPath = userPortFoliaImagePath + filename;
                    try {
                        fileUpload(portfolioImagePath, portfolioFolderPath);
                        query += `, artist_portfolio='${filename}'`
                    } catch (err) {
                        portfolioImageUploadError = err;
                    }
                }
            }

            if (is_profile_pic_updated != undefined) {
                if (profile_image == null) {
                    const getFilesQuery = `SELECT profile_pic FROM artist WHERE artist_id=${artist_id}`;
                    pool.query(query, async (error, result) => {
                        console.log(`sub-query result: ${JSON.stringify(result)}`);
                        console.log(`sub-query error: ${JSON.stringify(error)}`);
                        if (result.rows && result.rows[0].profile_pic != null) {
                            fs.promises.unlink(result.rows[0].profile_pic);
                            query += `, profile_pic='${"null"}'`;
                        }
                    });
                } else {
                    const profileImagePath = profile_image[0].filepath;
                    const filename = artist_id + "." + profile_image[0].originalFilename.split(".").pop();
                    const profileFolderPath = userProfileImagePath + filename;

                    try {
                        fileUpload(profileImagePath, profileFolderPath);
                        query += `, profile_pic='${filename}'`;

                    } catch (err) {
                        profileImageUploadError = err;
                    }
                }
            }

            query += ` WHERE artist_id=${artist_id}`;
            console.log(`query: ${query}`);
            pool.query(query, async (err, result) => {
                console.log(`err: ${err}`);
                console.log(`result: ${JSON.stringify(result)}`);
                if (err) {
                    res.status(500).send(
                        {
                            success: false,
                            messages: err,
                            statusCode: 500
                        }
                    )
                } else {
                    res.status(200).send(
                        {
                            success: true,
                            message: 'User Details Updated Successfully',
                            statusCode: 200,
                            profileImageUploadError: profileImageUploadError,
                            portfolioImageUploadError: portfolioImageUploadError,
                        }
                    );
                }
            })
        });


    } catch (error) {
        console.log(`error: ${error}`);
        res.status(500).send(
            {
                success: false,
                message: somethingWentWrong,
                statusCode: 500
            }
        )
    }
}
