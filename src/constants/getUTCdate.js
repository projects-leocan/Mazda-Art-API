const moment = require("moment-timezone");

exports.getUTCdate = (date) => {
    const utcDate = moment(date, 'UTC').format();
    return utcDate;
}