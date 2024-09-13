const Razorpay = require("razorpay");
const razorPayConfig = require("../../config/razorPayConfig");
const crypto = require("crypto");

exports.createOrderController = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: razorPayConfig.key_id,
      key_secret: razorPayConfig.key_secret,
    });

    const option = {
      amount: req.body.amount,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(option, (error, order) => {
      if (error) {
        console.log("eror", error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error });
  }
};
