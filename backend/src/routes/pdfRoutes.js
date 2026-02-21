const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const pdfController = require("../controllers/pdfController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "pdf_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  "/convert-pdf",
  upload.single("pdf"),
  pdfController.handleConvertPdf,
);

module.exports = router;
