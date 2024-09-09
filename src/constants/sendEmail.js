var nodemailer = require("nodemailer");
const { email, password } = require("./mailData");

exports.sendEmail = async (emailIds, subject, text) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      host: "smtp.gmail.com",
      port: 3030,
      secure: false,
      requireTLS: true,
      user: email,
      pass: password,
    },
  });
  console.log(`emailIds: ${emailIds}`);
  var mailOptions = {
    from: email,
    to: emailIds,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error while send mail", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
