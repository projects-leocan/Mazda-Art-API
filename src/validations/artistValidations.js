const formidable = require("formidable");
const _ = require("lodash")

exports.getArtistProfileValidation = (req, res, next) => {
    const { record_per_page, page_no, isAll } = req.query;
    if (record_per_page == undefined && page_no == undefined && isAll == undefined) {
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
}

exports.searchArtistValidation = (req, res, next) => {
    const search_text = req.query.search_text;
    if (search_text == undefined && search_text != "") {
        return res.status(500).send({
            success: false,
            message: "search_text can not be empty.",
        });
    }
    next();
}

exports.getArtistIdValidation = (req, res, next) => {
    const user_id = req.query.user_id;
    if (user_id == undefined && user_id != "") {
        return res.status(500).send({
            success: false,
            message: "search_text can not be empty.",
        });
    }
    next();
}

exports.updateArtistValidation = (req, res, next) => {
    const { artist_id, fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_link, portfolio, profile_pic, MOC } = req.body;
    if (Object.entries(req.body).length === 0) {
        return res.status(500).send({
            success: false,
            message: "Please Pass data in body",
        });
    }
    if (artist_id == undefined) {
        return res.status(500).send({
            success: false,
            message: "artist_id can not be empty.",
        });
    }
    if (fname != undefined && fname.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "first name can not be empty.",
        });
    }
    if (lname != undefined && lname.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "last name can not be empty.",
        });
    }
    if (dob != undefined && dob.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "date of Birth can not be empty.",
        });
    }
    if (gender != undefined && gender.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "Gender can not be empty.",
        });
    }
    if (email != undefined && email.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "email not be empty.",
        });
    }
    if (mobile_number != undefined && mobile_number.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "Mobile number can not be empty.",
        });
    }
    if (city != undefined && city.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "city can not be empty.",
        });
    }
    if (state != undefined && state.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "State can not be empty.",
        });
    }
    if (pincode != undefined && pincode.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "Pin code can not be empty.",
        });
    }
    if (social_media_link != undefined && social_media_link.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "Social Media Link can not be empty.",
        });
    }
    if (portfolio != undefined && portfolio.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "ARTIST PORTFOLIO can not be empty.",
        });
    }
    if (profile_pic != undefined && profile_pic.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "Artist Photo can not be empty.",
        });
    }
    if (MOC != undefined && MOC.length === 0) {
        return res.status(500).send({
            success: false,
            message: "Medium of Choice can not be empty.",
        });
    }

    next();
}

exports.getArtistDetailValidation = (req, res, next) => {

    const { fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_link, portfolio, profile_pic, MOC } = req.body;
    if (Object.entries(req.body).length === 0) {
        return res.status(500).send({
            success: false,
            message: "Please Pass data in body",
        });
    }
    if (fname == undefined && fname.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "first name can not be empty.",
        });
    }
    if (lname == undefined && lname.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "last name can not be empty.",
        });
    }
    if (dob == undefined && dob.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "date of Birth can not be empty.",
        });
    }
    if (gender == undefined && gender.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "Gender can not be empty.",
        });
    }
    if (email == undefined && email.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "email not be empty.",
        });
    }
    if (mobile_number == undefined && mobile_number.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "Mobile number can not be empty.",
        });
    }
    if (city == undefined && city.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "city can not be empty.",
        });
    }
    if (state == undefined && state.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "State can not be empty.",
        });
    }
    if (pincode == undefined && pincode.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "Pin code can not be empty.",
        });
    }
    if (social_media_link == undefined && social_media_link.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "Social Media Link can not be empty.",
        });
    }
    if (portfolio == undefined && portfolio.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "ARTIST PORTFOLIO can not be empty.",
        });
    }
    if (profile_pic == undefined && profile_pic.trim() === "") {
        return res.status(500).send({
            success: false,
            message: "Artist Photo can not be empty.",
        });
    }
    if (MOC == undefined && MOC.length === 0) {
        return res.status(500).send({
            success: false,
            message: "Medium of Choice can not be empty.",
        });
    }
    next();
}

exports.addArtistValidation = (req, res, next) => {

    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        const { fname, lname, dob, gender, email, mobile_number, address1, address2, city, state, pincode, social_media_link, portfolio, profile_pic, MOC } = fields;
        console.log(`validations: ${JSON.stringify(fields)}`);
        if (Object.entries(fields).length === 0) {
            return res.status(500).send({
                success: false,
                message: "Please Pass data in body",
            });
        }
        console.log('fname: ', fname);
        if (fname == undefined || _.isEmpty(fname)) {
            return res.status(500).send({
                success: false,
                message: "first name can not be empty.",
            });
        }
        if (lname == undefined || _.isEmpty(lname)) {
            return res.status(500).send({
                success: false,
                message: "last name can not be empty.",
            });
        }
        if (dob == undefined || _.isEmpty(dob)) {
            return res.status(500).send({
                success: false,
                message: "date of Birth can not be empty.",
            });
        }
        if (gender == undefined || _.isEmpty(gender)) {
            return res.status(500).send({
                success: false,
                message: "Gender can not be empty.",
            });
        }
        if (email == undefined || _.isEmpty(email)) {
            return res.status(500).send({
                success: false,
                message: "email not be empty.",
            });
        }
        if (mobile_number == undefined || _.isEmpty(mobile_number)) {
            return res.status(500).send({
                success: false,
                message: "Mobile number can not be empty.",
            });
        }
        if (city == undefined || _.isEmpty(city)) {
            return res.status(500).send({
                success: false,
                message: "city can not be empty.",
            });
        }
        if (state == undefined || _.isEmpty(state)) {
            return res.status(500).send({
                success: false,
                message: "State can not be empty.",
            });
        }
        if (pincode == undefined || _.isEmpty(pincode)) {
            return res.status(500).send({
                success: false,
                message: "Pin code can not be empty.",
            });
        }
        if (social_media_link == undefined || _.isEmpty(social_media_link)) {
            return res.status(500).send({
                success: false,
                message: "Social Media Link can not be empty.",
            });
        }
        if (portfolio == undefined || _.isEmpty(portfolio)) {
            return res.status(500).send({
                success: false,
                message: "ARTIST PORTFOLIO can not be empty.",
            });
        }
        if (profile_pic == undefined || _.isEmpty(profile_pic)) {
            return res.status(500).send({
                success: false,
                message: "Artist Photo can not be empty.",
            });
        }
        // if (MOC == undefined || MOC.length === 0) {
        //     return res.status(500).send({
        //         success: false,
        //         message: "Medium of Choice can not be empty.",
        //     });
        // }
        next();
    });
}