const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

router.post("/profile", upload.single("file"), async (req, res) => {
  // console.log("File received:", req.file); // Debugging line to check file object
  const { file } = req;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const validExtensions = [".jpg", ".jpeg", ".png"];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  // console.log("File extension:", fileExtension); // Debugging line to check file extension
  if (!validExtensions.includes(fileExtension)) {
    return res.status(400).json({ message: "Invalid file format" });
  }

  const filename = `${uuidv4()}${fileExtension}`;
  const folderPath = path.join(__dirname, "../public/profile");
  const filePath = path.join(folderPath, filename);

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    // console.log("Folder does not exist, creating it."); // Debugging line for folder creation
    fs.mkdirSync(folderPath, { recursive: true });
  }

  try {
    // console.log("Saving file to:", filePath); // Debugging line for file path
    await fs.promises.writeFile(filePath, file.buffer);
    // console.log("File saved successfully."); // Debugging line for success
    res.status(200).json({
      message: "Profile image uploaded successfully",
      url: `http://localhost:5000/sign-up/${filename}`,
    });
  } catch (error) {
    console.error("Error saving file:", error.message); // Log error for debugging
    res.status(500).json({ message: "Error while uploading", error: error.message });
  }
});

module.exports = router;
