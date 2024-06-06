exports.adminIdValidation = (req, res, next) => {
  const { admin_id } = req.query;
  if (admin_id == undefined || admin_id === "") {
    return res.status(500).send({
      success: false,
      message: "admin_id can not be Empty",
    });
  }
  next();
};
