const lodash = require("lodash");

exports.addContactUsValidation = (req, res, next) => {
  const { full_name, email, contact_no, message } = req.body;
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
  if (message == undefined || message === "") {
    return res.status(500).send({
      success: false,
      message: "Message can not be Empty",
    });
  }
  next();
};

exports.getAllContactUsValidation = (req, res, next) => {
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

exports.updateContactUsValidation = (req, res, next) => {
  const { id, message_response, email, status } = req.body;
  if (lodash.isEmpty(req.body)) {
    return res.status(500).send({
      success: false,
      message: "Pass data in body",
    });
  }
  if (id === undefined || id === "") {
    return res.status(500).send({
      success: false,
      message: "id can not be empty",
    });
  }
  if (message_response === undefined) {
    return res.status(500).send({
      success: false,
      message: "response can not be empty",
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
