require("dotenv").config();
const SibApiV3Sdk = require("sib-api-v3-sdk");

// Configure API key authorization
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const apiKey = SibApiV3Sdk.ApiClient.instance.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY; // Replace with your actual API key

async function sendEmail(toEmail, templateId, params) {
  console.log("send email", toEmail);
  const email = {
    sender: { email: "info@mazdaartfoundation.org", name: "Mazda Art" },
    to: [{ email: toEmail, name: params?.name }],
    templateId: +templateId,
    params: params,
  };

  try {
    const response = await apiInstance.sendTransacEmail(email);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendEmail };
