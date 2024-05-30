exports.submitGrantValidation = (req, res, next) => {
    const { artist_id, transaction_id, grant_id, art_file, art_title, art_height, art_width, art_description } = req.body;
    if (artist_id == undefined || artist_id === "") {
        return res.status(500).send({
            success: false,
            message: "artist Id can not be Empty",
        })
    }
    if (transaction_id == undefined || transaction_id === "") {
        return res.status(500).send({
            success: false,
            message: "transaction Id can not be Empty",
        })
    }
    if (grant_id == undefined || grant_id === "") {
        return res.status(500).send({
            success: false,
            message: "Grant Id can not be Empty",
        })
    }
    if (transaction_id == undefined || transaction_id === "") {
        return res.status(500).send({
            success: false,
            message: "transaction Id can not be Empty",
        })
    }
    if (transaction_id == undefined || transaction_id === "") {
        return res.status(500).send({
            success: false,
            message: "transaction Id can not be Empty",
        })
    }
    if (transaction_id == undefined || transaction_id === "") {
        return res.status(500).send({
            success: false,
            message: "transaction Id can not be Empty",
        })
    }
    if (transaction_id == undefined || transaction_id === "") {
        return res.status(500).send({
            success: false,
            message: "transaction Id can not be Empty",
        })
    }
    if (transaction_id == undefined || transaction_id === "") {
        return res.status(500).send({
            success: false,
            message: "transaction Id can not be Empty",
        })
    }
    if (transaction_id == undefined || transaction_id === "") {
        return res.status(500).send({
            success: false,
            message: "transaction Id can not be Empty",
        })
    }
    next();
}

exports.getSubmitGrantDetailValidation = (req, res, next) => {
    const { grant_submitted_id, } = req.query;
    if (grant_submitted_id == undefined || grant_submitted_id === "") {
        return res.status(500).send({
            success: false,
            message: "grant_submitted_id can not be Empty",
        })
    }
    next();
}

exports.getAllGrantSubmissionValidator = (req, res, next) => {
    const { jury_id, admin_id, record_per_page, page_no, isAll, } = req.query;
    if ((jury_id === undefined) && (admin_id === undefined)) {
        return res.status(500).send({
            success: false,
            message: "jury_id OR admin_id can not be Empty",
        })
    }
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
