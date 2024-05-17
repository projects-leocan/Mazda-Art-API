const multer = require("multer");
const pool = require("../../config/db");
const { somethingWentWrong } = require("../../constants/messages");
const formidable = require("formidable");
var util = require("util");
var fs = require("fs");
var path = require('path');
// const { handleFileUploads } = require("../../utils/fileUpload");


exports.updateUserController = async (req, res) => {

    console.log(`req.body: ${JSON.stringify()}`)
    try {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            let { artist_id, fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_link, portfolio, profile_pic, MOC, is_profile_pic_updated, is_portfolio_updated } = fields;

            const portfolio_image = files['portfolio']
            const profile_image = files['profile_pic']

            let;

            console.log(`portfolio_image: ${JSON.stringify(portfolio_image)}`)
            console.log(`profile_image: ${JSON.stringify(profile_image)}`)

            const newPath1 = portfolio_image[0].filepath;
            const portfolio_image_path = "src/files/user_portfolio/" + artist_id + ".png";
            // console.log(`portfolio_image_path: ${portfolio_image_path}`);
            fs.rename(newPath1, portfolio_image_path, (err) => {
                if (err) {
                    console.log(`Error moving portfolio_image: ${err}`);
                } else {
                    console.log("portfolio_image uploaded success !!!!!!!");
                }
            });

            const newPath2 = profile_image[0].filepath;
            const profile_image_path = "src/files/user_profile/" + artist_id + ".png";
            fs.rename(newPath2, profile_image_path, (err) => {
                if (err) {
                    console.log(`Error moving profile_image: ${err}`);
                } else {
                    console.log("profile_image uploaded success !!!!!!!");
                }
            });

            let query = `UPDATE artist set `;
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
            if (portfolio != undefined) {
                query += `, artist_portfolio='${portfolio}'`;
            }
            if (profile_pic != undefined) {
                query += `, profile_pic='${profile_pic}'`;
            }

            query += ` WHERE artist_id=${artist_id}`;
            query = "";
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
                            statusCode: 200
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
