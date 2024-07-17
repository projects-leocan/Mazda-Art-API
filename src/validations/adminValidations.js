exports.adminLoginValidation = (req, res, next) => {
  const { admin_email, admin_password } = req.query;
  if (admin_email === undefined || admin_email === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid email address",
    });
  }
  if (admin_password === undefined || admin_password === "") {
    return res.status(500).send({
      success: false,
      // message: "Invalid password",
      message: "Invalid Credential",
    });
  }
  next();
};

exports.addAdminValidator = (req, res, next) => {
  const {
    admin_name,
    admin_email,
    admin_password,
    admin_contact,
    admin_address,
  } = req.body;

  if (admin_email === undefined || admin_email === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid email address",
    });
  }
  if (admin_password === undefined || admin_password === "") {
    return res.status(500).send({
      success: false,
      // message: "Invalid password",
      message: "Invalid Credential",
    });
  }
  const regEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // console.log(`password validation: ${regEx.test(admin_password)}`);
  if (!regEx.test(admin_password)) {
    return res.status(500).send({
      success: false,
      message:
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).",
    });
  }
  if (admin_name === undefined || admin_name === "") {
    return res.status(500).send({
      success: false,
      message: "Name can not be Empty",
    });
  }
  if (admin_contact === undefined || admin_contact === "") {
    return res.status(500).send({
      success: false,
      message: "contact number can not be Empty",
    });
  }
  if (admin_address === undefined || admin_address === "") {
    return res.status(500).send({
      success: false,
      message: "Address can not be Empty",
    });
  }
  next();
};

exports.adminIdValidator = (req, res, next) => {
  const { admin_id, admin_name, admin_email, admin_contact, admin_address } =
    req.body;

  if (admin_id === undefined || admin_id === "") {
    return res.status(500).send({
      success: false,
      message: "admin id can not be empty",
    });
  }
  next();
};

exports.addCommentOnArtistProfileValidator = (req, res, next) => {
  const { admin_id, artist_id, comment } = req.body;

  if (admin_id === undefined || admin_id === "") {
    return res.status(500).send({
      success: false,
      message: "admin_id can not be empty",
    });
  }
  if (artist_id === undefined || artist_id === "") {
    return res.status(500).send({
      success: false,
      message: "artist_id id can not be empty",
    });
  }
  if (comment === undefined || comment === "") {
    return res.status(500).send({
      success: false,
      message: "comment can not be empty",
    });
  }
  next();
};

exports.getAllAdminValidator = (req, res, next) => {
  const { record_per_page, page_no, isAll } = req.query;
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

exports.getAdminDetailsValidator = (req, res, next) => {
  const { admin_id } = req.query;
  if (admin_id == undefined) {
    return res.status(500).send({
      success: false,
      message: "admin_id can not be empty",
    });
  }
  next();
};
