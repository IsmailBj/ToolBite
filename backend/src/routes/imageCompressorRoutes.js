const express = require("express");
const router = express.Router();
const multer = require("multer");
const imageController = require("../controllers/imageCompressorController");

// Use memory storage since we process images directly in RAM (very fast)
const storage = multer.memoryStorage();

// 15MB limit to prevent server overload
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

// The endpoint the frontend will hit
router.post(
  "/compress-image",
  upload.single("image"),
  imageController.handleCompressImage,
);

module.exports = router;
