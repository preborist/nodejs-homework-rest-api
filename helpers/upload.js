const multer = require('multer');
const { HttpCode } = require('./constatns');

require('dotenv').config();

const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes('image')) {
      const error = new Error('Bad requst');
      error.status = HttpCode.BAD_REQUEST;
      cb(error);
      return;
    }
    cb(null, true);
  },
});

module.exports = upload;
