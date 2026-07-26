const multer = require('multer');
const path = require('path');

// Stores uploads locally under backend/uploads/<folder>. If Cloudinary
// credentials are set (see config/cloudinary.js), controllers can push the
// saved file up to Cloudinary afterwards and store the resulting URL instead.
const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, `../uploads/${folder}`)),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed'));
};

const uploadEventImage = multer({
  storage: makeStorage('events'),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadProfileImage = multer({
  storage: makeStorage('profiles'),
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = { uploadEventImage, uploadProfileImage };
