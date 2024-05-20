const pool = require("../../config/db");
const _ = require("lodash");

exports.getAllGrantController = async (req, res) => {
    // const query = `SELECT * FROM grants`;
    const query = `SELECT g.*, m.medium_of_choice from public.grants as g, public.medium_of_choice as m where g."category_MOD" = m.id;`;
    try {
        pool.query(query, async (err, result) => {
            console.log(`err: ${err}`);
            console.log(`result: ${JSON.stringify(result)}`);
            if (err) {
                res.status(500).send(
                    {
                        success: false,
                        message: err,
                        statusCode: 500
                    }
                )
            } else {
                /*let data = [];
                if (!_.isEmpty(result.rows)) {
                    result.rows.map(async (element) => {

                        // get category value
                        const categoryQuery = `SELECT * FROM public.medium_of_choice WHERE id = ${element.category_MOD}`;
                        pool.query(categoryQuery, async (categoryErr, categoryResult) => {
                            // console.log(`categoryErr: ${categoryErr}`);
                            // console.log(`categoryResult: ${JSON.stringify(categoryResult)}`);
                            element.category_MOD = categoryResult.rows[0].medium_of_choice;
                        });

                        // get theme value
                        // const themeQuery = `SELECT * FROM public.theme WHERE id = ${element.theme_id}`;
                        const themeQuery = `SELECT g.*, m.medium_of_choice  from public.grants as g, public.medium_of_choice as m where g."category_MOD" = m.id;`;
                        pool.query(themeQuery, async (themeErr, themeResult) => {
                            element.theme_id = themeResult.rows[0].theme;
                            data.push(element);
                            // res.status(200).send(
                            //     {
                            //         success: true,
                            //         message: 'Grant fetched successfully',
                            //         data: data,
                            //         statusCode: 200
                            //     }
                            // )
                        });
                    })
                }*/
                res.status(200).send(
                    {
                        success: true,
                        message: 'Grant fetched successfully',
                        data: result.rows,
                        statusCode: 200
                    }
                )
            }
        })
    } catch (error) {
        console.log(`error: ${error}`);
        return res.status(500).send(
            {
                success: false,
                message: somethingWentWrong,
                statusCode: 500
            }
        )
    }
}