const { default: axios } = require("axios");
const { somethingWentWrong } = require("../constants/messages");
// const FingerprintJS = require('@fingerprintjs/fingerprintjs-pro')

exports.testController = async (req, res) => {
    let { pan_no } = req.query;

    try {
        // const options = {
        //     method: 'POST',
        //     url: 'https://aadhaar-verification-okyc.p.rapidapi.com/api/v1/VerifyCaptcha',
        //     headers: {
        //         'x-rapidapi-key': '425d2903c1msh18881a23f6b9ed0p170ad2jsn7855a0bbcbd8',
        //         'x-rapidapi-host': 'aadhaar-verification-okyc.p.rapidapi.com',
        //         'Content-Type': 'text/plain'
        //     },
        //     data: '{\n	"session_id": "7cdc50532b52be8b7d8cf31b49bb6450",\n	"uid_no": "",\n	"security_code": "gZ4So"\n}'
        // };

        // try {
        //     console.log('options: ', options);

        //     const response = await axios.request(options);
        //     console.log('response.data: ', response.data);
        //     console.log(response.data);
        // } catch (error) {
        //     console.error('error: ', error);
        //     console.error(error);
        // }
        const fpPromise = FingerprintJs.load({ apiKey: '' })

        // Analyze the visitor when necessary.
        fpPromise
            .then(fp => fp.get())
            .then(result => console.log(result.requestId, result.visitorId)
            );
        return res.status(200).send(
            {
                success: true,
                data: result,
                message: somethingWentWrong,
                statusCode: 200
            }
        )

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
