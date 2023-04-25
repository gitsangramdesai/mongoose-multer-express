var multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if (file.fieldname == "profilePic") {
            callback(null, './uploads/profilePic/');
        } else if (file.fieldname == "resume") {
            callback(null, './uploads/resume/');
        } else {
            callback(null, './uploads/other/');
        }
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname == "profilePic") {
        if ((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
    if (file.fieldname == "resume") {
        if ((file.mimetype).includes('doc') || (file.mimetype).includes('openxmlformats')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
};

var upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1 * 1024 * 1024 } })

module.exports = {
    upload: upload
}