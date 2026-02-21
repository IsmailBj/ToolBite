const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const officeController = require("../controllers/officeController");

// Multer configuration for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route definition
router.post(
  "/word-to-pdf",
  upload.single("word"),
  officeController.handleWordToPdf,
);

module.exports = router;
