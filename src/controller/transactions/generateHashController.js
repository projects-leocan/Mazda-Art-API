require("dotenv").config();
const crypto = require("crypto");

exports.generateHashController = async (req, res) => {
  try {
    const MERCHANT_KEY = process.env.PAYU_API_KEY;
    const MERCHANT_SALT = process.env.PAYU_SALT;

    console.log("merchant key", MERCHANT_KEY);
    console.log("merchant salt", MERCHANT_SALT);

    const { amount, productInfo, customerName, email, phone, surl, furl } =
      req.body;
    console.log("req body", req.body);
    // Validate input
    if (!amount || !productInfo || !customerName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const txnid = `txn_${Math.random().toString(36).substr(2, 9)}`;
    const hashString = `${MERCHANT_KEY}|${txnid}|${amount.toString()}|${productInfo}|${customerName}|${email}|||||||||||${MERCHANT_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const payuData = {
      key: MERCHANT_KEY,
      txnid: txnid,
      amount: amount,
      productinfo: productInfo,
      firstname: customerName,
      email: email,
      phone: phone,
      surl: surl, // Success callback URL
      furl: furl, // Failure callback URL
      hash: hash,
      service_provider: "",
      // disableRetry: "true",
    };

    console.log("payuData", payuData);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Hash generated successfully!",
      data: payuData,
    });
  } catch (error) {
    console.error("Error generating hash:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
