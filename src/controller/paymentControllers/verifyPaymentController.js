const crypto = require("crypto");
const razorPayConfig = require("../../config/razorPayConfig");

exports.verifyPaymentController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", razorPayConfig.key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment Verified Successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
