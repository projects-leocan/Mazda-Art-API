var nodemailer = require("nodemailer");
const { email, password } = require("./mailData");

exports.sendEmail = async (emailIds, subject, text) => {
  console.log("email is", emailIds);
  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     host: "smtp.gmail.com",
  //     port: 465,
  //     secure: false,
  //     // requireTLS: true,
  //     // user: email,
  //     // pass: password,
  //     auth: {
  //       user: email,
  //       pass: password,
  //     },
  //   },
  // });
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // or 465, but be aware of the deprecation
    secure: false, // or true, depending on the port
    auth: {
      user: email,
      pass: password,
    },
  });

  console.log(`emailIds: ${JSON.stringify(transporter)}`);
  const mailOptions = {
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
