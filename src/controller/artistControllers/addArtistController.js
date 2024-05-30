const pool = require("../../config/db")
const { somethingWentWrong } = require("../../constants/messages");
const formidable = require("formidable");
const { fileUpload } = require("../../utils/fileUpload");
const { userPortFoliaImagePath, userProfileImagePath } = require("../../constants/filePaths");
var lodash = require("lodash");
const { getUserDetails } = require("./getArtistDetail");

exports.addArtistController = async (req, res) => {

    console.log(`req.body: ${JSON.stringify()}`)
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            let { fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_link, portfolio_file_ext, profile_pic_file_ext, is_portfolio_updated, is_profile_pic_updated } = fields;

            console.log(`controller: ${JSON.stringify(fields)}`);

            const portfolio_image = files['portfolio']
            const profile_image = files['profile_pic']

            const currentTime = new Date().toISOString().slice(0, 10);
            let profileImageUploadError = "", portfolioImageUploadError = "";

            // const data = [fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_link, currentTime, currentTime];
            let query = `INSERT INTO public.artist(fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_profile_link, artist_portfolio, profile_pic, created_at, updated_at) VALUES ('${fname}', '${lname}', '${dob}', '${gender}', '${email}', '${mobile_number}', '${address1}', '${address2}', '${city}', '${state}', ${pincode}, '${social_media_link}', 'null', 'null', '${currentTime}', '${currentTime}') RETURNING artist_id`;
            pool.query(query, async (newErr, newResult) => {
                console.log('query: ', query);
                console.log(`newErr: ${JSON.stringify(newErr)}`);
                console.log(`newResult: ${JSON.stringify(newResult)}`);
                if (newErr) {
                    if (newErr.detail === `Key (email)=(${email}) already exists.`) {
                        res.status(500).send(
                            {
                                success: false,
                                messages: `${email} is already exists.`,
                                statusCode: 500,
                                profileImageUploadError: profileImageUploadError,
                                portfolioImageUploadError: portfolioImageUploadError,
                            }
                        )
                    } else {
                        res.status(500).send(
                            {
                                success: false,
                                messages: "Something went wrong",
                                statusCode: 500,
                                profileImageUploadError: profileImageUploadError,
                                portfolioImageUploadError: portfolioImageUploadError,
                            }
                        )
                    }
                } else {
                    const artist_id = newResult.rows[0].artist_id;

                    if (is_portfolio_updated != undefined || is_profile_pic_updated != undefined) {
                        const updateImagesQuery = `UPDATE artist set `;

                        if (is_portfolio_updated != undefined) {
                            console.log(`portfolio_image: ${JSON.stringify(portfolio_image)}`);
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
                            console.log(`portfolio_image: ${JSON.stringify(portfolio_image)}`);
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