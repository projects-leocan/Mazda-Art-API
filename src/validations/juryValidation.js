exports.addJuryValidation = (req, res, next) => {
  const {
    fullName,
    email,
    contact_no,
    password,
    address,
    designation,
    DOB,
    about,
    links,
  } = req.body;
  if (req.body == undefined || req.body === "") {
    return res.status(500).send({
      success: false,
      message: "Pass data in Body field.",
    });
  }
  if (fullName == undefined || fullName === "") {
    return res.status(500).send({
      success: false,
      message: "full name can not be Empty",
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
      message: "contact no can not be Empty",
    });
  }
  if (password == undefined || password === "") {
    return res.status(500).send({
      success: false,
      message: "password can not be Empty",
    });
  }
  if (address == undefined || address === "") {
    return res.status(500).send({
      success: false,
      message: "address can not be Empty",
    });
  }
  if (designation == undefined || designation === "") {
    return res.status(500).send({
      success: false,
      message: "designation can not be Empty",
    });
  }
  if (DOB == undefined || DOB === "") {
    return res.status(500).send({
      success: false,
      message: "Date of Birth can not be Empty",
    });
  }
  // if (links == undefined || links == []) {
  //     return res.status(500).send({
  //         success: false,
  //         message: "Jury Links can not be Empty",
  //     })
  // }
  // if (about == undefined || about === "") {
  //     return res.status(500).send({
  //         success: false,
  //         message: "About can not be Empty",
  //     })
  // }
  next();
};
exports.getAllJuryValidation = (req, res, next) => {
  const { record_per_page, page_no, isAll, admin_id } = req.query;
  if (admin_id == undefined || admin_id === "") {
    return res.status(500).send({
      success: false,
      message: "admin Id can not be Empty",
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
exports.updateJuryValidation = (req, res, next) => {
  const {
    jury_id,
    password,
    fullName,
    email,
    contact_no,
    address,
    designation,
    DOB,
    about,
    links,
    isFirstTimeSignIn,
  } = req.body;
  if (jury_id == undefined || jury_id === "") {
    return res.status(500).send({
      success: false,
      message: "Jury id can not be Empty",
    });
  }
  if (fullName != undefined && fullName === "") {
    return res.status(500).send({
      success: false,
      message: "full name can not be Empty",
    });
  }
  if (email != undefined && email === "") {
    return res.status(500).send({
      success: false,
      message: "email can not be Empty",
    });
  }
  if (contact_no != undefined && contact_no === "") {
    return res.status(500).send({
      success: false,
      message: "contact no can not be Empty",
    });
  }
  if (password != undefined && password === "") {
    return res.status(500).send({
      success: false,
      message: "password can not be Empty",
    });
  }
  if (address != undefined && address === "") {
    return res.status(500).send({
      success: false,
      message: "address can not be Empty",
    });
  }
  if (designation != undefined && designation === "") {
    return res.status(500).send({
      success: false,
      message: "designation can not be Empty",
    });
  }
  if (DOB != undefined && DOB === "") {
    return res.status(500).send({
      success: false,
      message: "Date of Birth can not be Empty",
    });
  }
  // if (admin_id == undefined || admin_id === "") {
  //     return res.status(500).send({
  //         success: false,
  //         message: "Admin id can not be Empty",
  //     })
  // }
  next();
};
exports.getJuryDetailValidation = (req, res, next) => {
  const { jury_id } = req.query;
  if (jury_id == undefined || jury_id === "") {
    return res.status(500).send({
      success: false,
      message: "jury Id can not be Empty",
    });
  }
  // if (admin_id == undefined || admin_id === "") {
  //     return res.status(500).send({
  //         success: false,
  //         message: "Admin id can not be Empty",
  //     })
  // }
  next();
};

exports.juryLoginValidation = (req, res, next) => {
  const { email, password } = req.query;
  if (email == undefined || email === "") {
    return res.status(500).send({
      success: false,
      message: "Email can not be Empty",
    });
  }
  if (password == undefined || password === "") {
    return res.status(500).send({
      success: false,
      message: "Password can not be Empty",
    });
  }
  next();
};
exports.getJuryGrantsValidation = (req, res, next) => {
  const { jury_id, record_per_page, page_no, isAll } = req.query;
  if (jury_id == undefined || jury_id === "") {
    return res.status(500).send({
      success: false,
      message: "jury_id can not be Empty",
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
