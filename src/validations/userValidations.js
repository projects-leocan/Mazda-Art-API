exports.getUserProfileValidation = (req, res, next) => {
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

exports.searchUserValidation = (req, res, next) => {
    const search_text = req.query.search_text;
    if (search_text == undefined && search_text != "") {
        return res.status(500).send({
            success: false,
            message: "search_text can not be empty.",
        });
    }
    next();
}

exports.updateUserValidation = (req, res, next) => {
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

exports.getUserDetailValidation = (req, res, next) => {
    
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