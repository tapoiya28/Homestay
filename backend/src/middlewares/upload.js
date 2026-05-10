// src/middleware/upload.js
const multer = require('multer');

const storage = multer.memoryStorage(); // keep files in memory (no temp files)

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
});

module.exports = upload;
