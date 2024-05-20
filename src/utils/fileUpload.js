// const multer = require('multer');

// exports.fileUploadAndGetUrl = () => {
//     return new Promise((resolve, reject) => {
//         upload(req, res, (err) => {
//             if (err) {
//                 return reject(err);
//             }
//             resolve(req.file.path);
//         });
//     });
// }

// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// // Set up storage engine with dynamic destination
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         let { is_profile_pic_updated, is_portfolio_updated } = req.body;
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         const user_id = req.body.user_id;
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, user_id + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage }).single('image');

const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

// Custom function to handle file uploads and return the file paths
exports.fileUpload = (storagePath, filePath) => {
    fs.rename(storagePath, filePath, (err) => {
        console.log(`storagePath: ${storagePath}`);
        console.log(`filePath: ${filePath}`);
        if (err) {
            console.log(`Error moving file: ${err}`);
            return err;
        } else {
            console.log("file uploaded success !!!!!!!");
        }
    });
}
