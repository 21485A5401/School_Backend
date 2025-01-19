const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../public/upload');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const LogoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const filename = "SchoolLogo" + '-' + Date.now() + '.' + file.mimetype.split("/")[1];
        cb(null, filename);
    }
});



let LogoUpload = multer({ storage: LogoStorage });
// upload = multer()
module.exports = {
    LogoUpload,
}