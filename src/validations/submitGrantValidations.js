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