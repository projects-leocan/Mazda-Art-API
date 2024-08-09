const _ = require("lodash");
exports.assignGrantToJuryValidator = (req, res, next) => {
  const { jurys, grant_id, admin_id } = req.body;
  if (jurys == undefined || _.isEmpty(jurys)) {
    return res.status(500).send({
      success: false,
      message: "jurys can not be Empty",
    });
  }
  if (grant_id == undefined || grant_id === "") {
    return res.status(500).send({
      success: false,
      message: "grant_id can not be Empty",
    });
  }
  if (admin_id == undefined && admin_id === "") {
    return res.status(500).send({
      success: false,
      message: "admin_id can not be Empty",
    });
  }
  next();
};

exports.getGrantJuryMappingValidation = (req, res, next) => {
  const { record_per_page, page_no, isAll, admin_id } = req.query;
  if (admin_id === undefined || admin_id === "") {
    return res.status(500).send({
      success: false,
      message: "admin_id can not be Empty",
    });
  }
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
  if (isAll == undefined && record_per_page == undefined) {
    return res.status(500).send({
      success: false,
      message: "record_per_page can not be Empty",
    });
  }
  next();
};

exports.updateGrantStatusValidator = (req, res, next) => {
  const {
    grant_id,
    jury_id,
    status,
    comment,
    submission_id,
    starts,
    artist_email,
  } = req.body;
  if (status == undefined || status === "") {
    return res.status(500).send({
      success: false,
      message: "status can not be Empty",
    });
  }
  if (grant_id == undefined || grant_id === "") {
    return res.status(500).send({
      success: false,
      message: "grant_id can not be Empty",
    });
  }
  if (jury_id == undefined || jury_id === "") {
    return res.status(500).send({
      success: false,
      message: "jury_id can not be Empty",
    });
  }
  if (submission_id == undefined || submission_id === "") {
    return res.status(500).send({
      success: false,
      message: "submission_id can not be Empty",
    });
  }
  // if (starts == undefined || starts === "") {
  //   return res.status(500).send({
  //     success: false,
  //     message: "starts can not be Empty",
  //   });
  // }
  if (artist_email == undefined || artist_email === "") {
    return res.status(500).send({
      success: false,
      message: "artist_email can not be Empty",
    });
  }
  next();
};

exports.getGrantJuryMappingDetailsValidation = (req, res, next) => {
  const { grant_id, admin_id } = req.query;
  if (admin_id === undefined || admin_id === "") {
    return res.status(500).send({
      success: false,
      message: "admin_id can not be Empty",
    });
  }

  if (grant_id === undefined || grant_id === "") {
    return res.status(500).send({
      success: false,
      message: "grant_id can not be Empty",
    });
  }

  next();
};
