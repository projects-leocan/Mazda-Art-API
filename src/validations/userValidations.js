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