const pool = require("../../config/db")
const { somethingWentWrong } = require("../../constants/messages");
const formidable = require("formidable");
const { fileUpload } = require("../../utils/fileUpload");
const { userPortFoliaImagePath, userProfileImagePath } = require("../../constants/filePaths");
var lodash = require("lodash");
const { getUserDetails } = require("./getUserDetail");

exports.addUserController = async (req, res) => {

    console.log(`req.body: ${JSON.stringify()}`)
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            let { fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_link, portfolio, profile_pic, portfolio_file_ext, profile_pic_file_ext, } = fields;

            console.log(`Object.keys(fields).length: ${Object.keys(fields).length}`);
            if (Object.keys(fields).length === 0) {
                res.status(500).send(
                    {
                        success: false,
                        message: "Pass data in body",
                        statusCode: 500
                    }
                )
            }

            const currentTime = new Date().toISOString().slice(0, 10);
            let profileImageUploadError = "", portfolioImageUploadError = "";

            const data = [fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_link, currentTime, currentTime];
            let query = `INSERT INTO public.artist(
                fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_profile_link, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING artist_id`;
            if (Object.keys(fields).length === 0) {
                res.status(500).send(
                    {
                        success: false,
                        message: "Pass data in body",
                        statusCode: 500
                    }
                )
            }
            pool.query(query, data, async (newErr, newResult) => {
                if (newErr) {
                    res.status(500).send(
                        {
                            success: false,
                            messages: "Something went wrong",
                            statusCode: 500,
                            profileImageUploadError: profileImageUploadError,
                            portfolioImageUploadError: portfolioImageUploadError,
                        }
                    )
                } else {

                    const artist_id = newResult.rows[0].artist_id;

                    if (is_portfolio_updated != undefined || is_profile_pic_updated != undefined) {
                        const updateImagesQuery = `UPDATE artist set `;

                        if (is_portfolio_updated != undefined) {
                            const portfolioImagePath = portfolio_image[0].filepath;
                            const filename = artist_id + "_" + Date.now() + `.${portfolio_file_ext}`
                            const portfolioFolderPath = userPortFoliaImagePath + filename;
                            try {
                                fileUpload(portfolioImagePath, portfolioFolderPath);
                                updateImagesQuery += `artist_portfolio='${filename}'`
                            } catch (err) {
                                portfolioImageUploadError = err;
                            }
                        }

                        if (is_profile_pic_updated != undefined) {
                            const profileImagePath = profile_image[0].filepath;
                            const filename = artist_id + "_" + Date.now() + `.${profile_pic_file_ext}`
                            const profileFolderPath = userProfileImagePath + filename;
                            try {
                                fileUpload(profileImagePath, profileFolderPath);
                                if (is_portfolio_updated != undefined && portfolioImageUploadError === "") {
                                    updateImagesQuery += `, profile_pic='${filename}'`;
                                } else {
                                    updateImagesQuery += `profile_pic='${filename}'`;
                                }
                            } catch (err) {
                                profileImageUploadError = err;
                            }
                        }
                        updateImagesQuery += ` WHERE artist_id=${artist_id}`;
                        console.log(`updateImagesQuery: ${updateImagesQuery}`);
                        const updatedResult = await pool.query(updateImagesQuery);
                    }

                    getUserDetails(artist_id, 'User Details Updated Successfully', res, req);
                }
            })

            if (artist_id != undefined && artist_id === "") {
                res.status(500).send(
                    {
                        success: false,
                        message: "artist_id can not be  empty.",
                        statusCode: 500
                    }
                )
            }
            const portfolio_image = files['portfolio']
            const profile_image = files['profile_pic']

            console.log(`portfolio_image: ${portfolio_image}`)
            console.log(`profile_image: ${profile_image}`)

            console.log(`portfolio: ${portfolio}`)
            console.log(`profile_pic: ${profile_pic}`)


            console.log(`query: ${query}`);
            pool.query(query, async (err, result) => {
                // console.log(`err: ${err}`);
                // console.log(`result: ${JSON.stringify(result)}`);
                if (err) {
                    res.status(500).send(
                        {
                            success: false,
                            messages: err,
                            statusCode: 500
                        }
                    )
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