const pool = require("../../config/db");
const { getUTCdate } = require("../../constants/getUTCdate");
const { email, password } = require("../../constants/mailData");
const { somethingWentWrong } = require("../../constants/messages");
const _ = require('lodash');
var nodemailer = require('nodemailer');
var Mailgun = require('mailgun').Mailgun;

exports.assignGrantToJuryController = async (req, res) => {
    const { jury_ids, grant_id, admin_id } = req.body;
    console.log("assignGrantToJuryController called !!!!!!!!!!");

    try {
        let query = `INSERT INTO grant_assign( jury_id, grant_id, assign_by) `;
        jury_ids.map((e) => {
            let lastElement = _.last(jury_ids);
            console.log(`jury_id: ${e}`);
            query += `SELECT ${e}, ${grant_id}, ${admin_id}
            WHERE NOT EXISTS (
                SELECT 1 FROM grant_assign WHERE jury_id = ${e} AND grant_id = ${grant_id}
            )`;

            if (e != lastElement) {
                query += `UNION ALL `;
            }
        });
        // console.log(`query: ${query}`);
        pool.query(query, async (err, result) => {

            // console.log(`err: ${err}`);
            // console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        message: err,
                        statusCode: 500
                    }
                )
            } else {
                const juryData = await Promise.all(jury_ids.map(async (e) => {
                    const result = await pool.query(`SELECT id, full_name, email, contact_no, address, designation, dob, about, created_at FROM jury WHERE id = ${e}`);
                    return result.rows[0]
                }))

                const sendmail = require('sendmail')({
                    logger: {
                        debug: console.log,
                        info: console.info,
                        warn: console.warn,
                        error: console.error
                    },
                    silent: false,
                    dkim: { // Default: False
                        privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
                        keySelector: 'mydomainkey'
                    },
                    devPort: 1025, // Default: False
                    devHost: 'localhost', // Default: localhost
                    smtpPort: 2525, // Default: 25
                    smtpHost: 'localhost' // Default: -1 - extra smtp host after resolveMX
                })
                /* Mailgun
                var mg = new Mailgun('Mazda-Art-API-KEY');
                const mail = mg.sendText(email, ['archiejames70@gmail.com'],
                    'This is the subject',
                    'This is the text',
                    function (err) {
                        if (err) console.log('Oh noes: ' + err);
                        else console.log('Success');
                    });
                console.log('mail: ', mail)*/

                /* nodemailer
                 var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        host: 'smtp.gmail.com',
                        port: 3030,
                        secure: false,
                        requireTLS: true,
                        user: email,
                        pass: password
                    }
                });
                var mailOptions = {
                    from: email,
                    to: 'archiejames70@gmail.com',
                    subject: 'Grant assign in you',
                    text: 'This is testing mail...'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });*/
                res.status(200).send(
                    {
                        success: true,
                        message: 'Grant assigned to Jurys successfully.',
                        data: juryData,
                        statusCode: 200
                    }
                )
            }
        })
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