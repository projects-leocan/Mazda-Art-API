const moment = require("moment-timezone");

exports.getUTCdate = (date) => {
  let utcDate;
  try {
    utcDate = moment(date, "UTC").format();
  } catch (error) {
    // console.log(`utcDate error: ${error}`);
    utcDate = error;
  }
  return utcDate;
};
