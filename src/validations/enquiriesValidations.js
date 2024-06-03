exports.addEnquiryValidation = (req, res, next) => {
    const { full_name, email, contact_no, message } = req.body;
    if (full_name == undefined || full_name === "") {
        return res.status(500).send({
            success: false,
            message: "full_name can not be Empty",
        })
    }
    if (email == undefined || email === "") {
        return res.status(500).send({
            success: false,
            message: "email can not be Empty",
        })
    }
    if (contact_no == undefined || contact_no === "") {
        return res.status(500).send({
            success: false,
            message: "contact_no can not be Empty",
        })
    }
    if (message == undefined || message === "") {
        return res.status(500).send({
            success: false,
            message: "message can not be Empty",
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
    if ((admin_id == undefined) && (jury_id == undefined)) {
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

exports.getTransactionDetailValidation = (req, res, next) => {
    const { transaction_id } = req.query;
    if (transaction_id == undefined) {
        return res.status(500).send({
            success: false,
            message: "transaction_id can not be Empty",
        })
    }
    next();
}