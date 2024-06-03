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

exports.getAllEnquiryValidation = (req, res, next) => {
    const { admin_id, record_per_page, page_no, isAll } = req.query;
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
    if (admin_id == undefined && admin_id == undefined) {
        return res.status(500).send({
            success: false,
            message: "admin_id can not be Empty",
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
