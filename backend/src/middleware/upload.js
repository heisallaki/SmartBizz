const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ApiError = require("../utils/ApiError");

const UPLOAD_ROOT = path.join(__dirname, "..", "..", "uploads");
const LOGO_DIR = path.join(UPLOAD_ROOT, "logos");

fs.mkdirSync(LOGO_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, LOGO_DIR);
  },
  filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase() || ".png";
    const uniqueName = `logo-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(new Error("Only PNG, JPG, and WEBP images are allowed."));
    return;
  }
  cb(null, true);
}

const uploadLogo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

function handleLogoUpload(req, res, next) {
  uploadLogo.single("logo")(req, res, (err) => {
    if (err) {
      next(ApiError.badRequest(err.message || "Could not process the uploaded file."));
      return;
    }
    next();
  });
}

module.exports = { handleLogoUpload, LOGO_DIR, UPLOAD_ROOT };