const _ = require("lodash");

exports.addGrantValidation = (req, res, next) => {
  const {
    admin_id,
    category_id,
    max_height,
    max_width,
    min_height,
    min_width,
    venue,
    theme_id,
    app_fees,
    submission_end_date,
    max_allow_submision,
    no_of_awards,
    no_of_nominations,
    rank_1_price,
    rank_2_price,
    rank_3_price,
    nominee_price,
    grand_amount,
  } = req.body;
  // console.log(`req.body: ${JSON.stringify(req.body)}`);
  if (_.isEmpty(req.body)) {
    return res.status(500).send({
      success: false,
      message: "Pass data in body",
    });
  }
  if (admin_id === undefined || admin_id === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid admin id can not be empty",
    });
  }
  if (category_id === undefined || category_id === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid category id can not be empty",
    });
  }
  if (max_height === undefined || max_height === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid height can not be empty",
    });
  }
  if (max_width === undefined || max_width === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid width can not be empty",
    });
  }
  if (min_height === undefined || min_height === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid height can not be empty",
    });
  }
  if (min_width === undefined || min_width === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid width can not be empty",
    });
  }
  if (venue === undefined || venue === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid venue can not be empty",
    });
  }
  if (theme_id === undefined || theme_id === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid theme id can not be empty",
    });
  }
  // if (app_fees === undefined || app_fees === "") {
  //   return res.status(500).send({
  //     success: false,
  //     message: "Invalid app fees can not be empty",
  //   });
  // }
  if (submission_end_date === undefined || submission_end_date === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid submission end date can not be empty",
    });
  }
  // if (max_allow_submision === undefined || max_allow_submision === "") {
  //   return res.status(500).send({
  //     success: false,
  //     message: "Invalid max allow submission can not be empty",
  //   });
  // }
  // if (no_of_awards === undefined || no_of_awards === "") {
  //   return res.status(500).send({
  //     success: false,
  //     message: "Invalid no of awards can not be empty",
  //   });
  // }
  if (no_of_nominations === undefined || no_of_nominations === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid number of nominations can not be empty",
    });
  }
  if (rank_1_price === undefined || rank_1_price === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid rank 1 price can not be empty",
    });
  }
  if (rank_2_price === undefined || rank_2_price === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid rank 2 price can not be empty",
    });
  }
  if (rank_3_price === undefined || rank_3_price === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid rank 3 price id can not be empty",
    });
  }
  if (nominee_price === undefined || nominee_price === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid nominee price can not be empty",
    });
  }
  if (grand_amount === undefined || grand_amount === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid grand amount can not be empty",
    });
  }
  next();
};

exports.updateGrantValidation = (req, res, next) => {
  const {
    grant_id,
    admin_id,
    category_id,
    max_height,
    max_width,
    min_height,
    min_width,
    venue,
    theme_id,
    // app_fees,
    submission_end_date,
    // max_allow_submision,
    no_of_awards,
    no_of_nominations,
    rank_1_price,
    rank_2_price,
    rank_3_price,
    nominee_price,
    grand_amount,
    is_flat_pyramid,
  } = req.body;
  if (_.isEmpty(req.body)) {
    return res.status(500).send({
      success: false,
      message: "Pass data in body",
    });
  }
  if (grant_id === undefined || grant_id === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid grant id can not be empty",
    });
  }
  if (is_flat_pyramid === undefined) {
    return res.status(500).send({
      success: false,
      message: "is_flat_pyramid can not be empty",
    });
  }
  next();
};

exports.getGrantDetailValidation = (req, res, next) => {
  const { grant_id } = req.query;
  // if (_.isEmpty(req.body)) {
  //     return res.status(500).send({
  //         success: false,
  //         message: "Pass data in Params",
  //     });
  // }
  if (grant_id === undefined || grant_id === "") {
    return res.status(500).send({
      success: false,
      message: "Invalid grant id can not be empty",
    });
  }
  next();
};

exports.getGrantAllSubmissionsValidation = (req, res, next) => {
  const { grant_id, jury_id, admin_id } = req.query;
  if (jury_id === undefined && admin_id === undefined) {
    return res.status(500).send({
      success: false,
      message: "grant_id OR admin_id can not be empty",
    });
  }
  if (grant_id === undefined || grant_id === "") {
    return res.status(500).send({
      success: false,
      message: "grant_id can not be empty",
    });
  }
  next();
};

exports.getAllGrantValidation = (req, res, next) => {
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
