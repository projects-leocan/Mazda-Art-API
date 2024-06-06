const lodash = require("lodash");

exports.addEnquiryValidation = (req, res, next) => {
  const { full_name, email, contact_no, enquiry_query } = req.body;
  if (full_name == undefined || full_name === "") {
    return res.status(500).send({
      success: false,
      message: "full_name can not be Empty",
    });
  }
  if (email == undefined || email === "") {
    return res.status(500).send({
      success: false,
      message: "email can not be Empty",
    });
  }
  if (contact_no == undefined || contact_no === "") {
    return res.status(500).send({
      success: false,
      message: "contact_no can not be Empty",
    });
  }
  if (enquiry_query == undefined || enquiry_query === "") {
    return res.status(500).send({
      success: false,
      message: "Query can not be Empty",
    });
  }
  next();
};

exports.getAllEnquiryValidation = (req, res, next) => {
  const { admin_id, record_per_page, page_no, isAll } = req.query;
  if (
    record_per_page == undefined &&
    page_no == undefined &&
    isAll == undefined
  ) {
    return res.status(500).send({
      success: false,
      message: "record_per_page and page_no OR isAll can not be Empty",
    });
  }
  if (isAll == undefined && page_no == undefined) {
    return res.status(500).send({
      success: false,
      message: "page_no can not be Empty",
    });
  }
  if (admin_id == undefined && admin_id == undefined) {
    return res.status(500).send({
      success: false,
      message: "admin_id can not be Empty",
    });
  }
  if (isAll == undefined && record_per_page == undefined) {
    return res.status(500).send({
      success: false,
      message: "record_per_page can not be Empty",
    });
  }
  next();
};

exports.updateEnquiryValidation = (req, res, next) => {
  const { enquiry_id, response, email, status } = req.body;
  if (lodash.isEmpty(req.body)) {
    return res.status(500).send({
      success: false,
      message: "Pass data in body",
    });
  }
  if (enquiry_id === undefined || enquiry_id === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid grant id can not be empty",
    });
  }
  if (response === undefined) {
    return res.status(500).send({
      success: false,
      message: "message can not be empty",
    });
  }
  if (email === undefined) {
    return res.status(500).send({
      success: false,
      message: "email can not be empty",
    });
  }
  if (status === undefined) {
    return res.status(500).send({
      success: false,
      message: "status can not be empty",
    });
  }
  next();
};
