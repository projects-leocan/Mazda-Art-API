exports.addTransactionValidation = (req, res, next) => {
    const { artist_id, grant_id, transaction_id, payment_init_date, payment_status, transaction_amount, payment_success_date } = req.body;
    if (artist_id == undefined || artist_id === "") {
        return res.status(500).send({
            success: false,
            message: "artist_id can not be Empty",
        })
    }
    if (grant_id == undefined || grant_id === "") {
        return res.status(500).send({
            success: false,
            message: "grant_id can not be Empty",
        })
    }
    if (transaction_id == undefined || transaction_id === "") {
        return res.status(500).send({
            success: false,
            message: "transaction_id can not be Empty",
        })
    }
    if (payment_init_date == undefined || payment_init_date === "") {
        return res.status(500).send({
            success: false,
            message: "payment_init_date can not be Empty",
        })
    }
    if (payment_status == undefined || payment_status === "") {
        return res.status(500).send({
            success: false,
            message: "payment_status can not be Empty",
        })
    }
    if (transaction_amount == undefined || transaction_amount === "") {
        return res.status(500).send({
            success: false,
            message: "transaction_amount can not be Empty",
        })
    }
    if (payment_success_date == undefined || payment_success_date === "") {
        return res.status(500).send({
            success: false,
            message: "payment_success_date can not be Empty",
        })
    }
    next();
}

exports.updateTransactionValidation = (req, res, next) => {
    const { id } = req.body;
    if (id == undefined || id === "") {
        return res.status(500).send({
            success: false,
            message: "id can not be Empty",
        })
    }
    next();
}

exports.getAllTransactionValidation = (req, res, next) => {
    const { admin_id, jury_id, record_per_page, page_no, isAll } = req.query;
    if (admin_id == undefined || admin_id === "" || jury_id == undefined || jury_id === "") {
        return res.status(500).send({
            success: false,
            message: "admin_id OR jury_id can not be Empty",
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