const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

exports.createOrderController = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const option = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await instance.orders.create(option);
    // const order = await instance.escrow.create(option);

    res.json({
      success: true,
      order_id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error });
  }
};
