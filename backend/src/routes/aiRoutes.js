const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const aiController = require("../controllers/aiController");

// Switch to DiskStorage to avoid buffer recognition issues in AI library
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  "/remove-bg",
  upload.single("image"),
  aiController.handleRemoveBackground,
);

module.exports = router;
