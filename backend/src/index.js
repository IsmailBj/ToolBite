const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const aiRoutes = require("./routes/aiRoutes");
const officeRoutes = require("./routes/officeRoutes");
const ImgCompressRoutes = require("./routes/imageCompressorRoutes");

const app = express();
const PORT = 8000;

// Ensure 'uploads' exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Register modular routes
app.use("/api", aiRoutes);
app.use("/api", officeRoutes);
app.use("/api", ImgCompressRoutes);

app.get("/", (req, res) => res.send("ToolBite API is online"));

app.listen(PORT, () =>
  console.log(`🚀 ToolBite Server running at http://localhost:${PORT}`),
);
