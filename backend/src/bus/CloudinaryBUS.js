const cloudinary = require('../config/cloudinary');

/**
 * Upload a single file (buffer) to Cloudinary.
 * @param {Object} file - Multer file object (buffer + originalname + mimetype)
 * @returns {Promise<string>} - Secure URL of the uploaded image
 */
async function uploadSingle(file) {
    if (!file) throw new Error('No file provided');

    return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            {
                folder: 'homeStayDorm/rooms',
                public_id: `${Date.now()}_${file.originalname}`,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        upload.end(file.buffer);
    });
}

/**
 * Upload multiple files (max 10) to Cloudinary.
 * @param {Array<Object>} files – Multer file objects
 * @returns {Promise<string[]>} – Array of secure URLs
 */
async function uploadMultiple(files) {
    if (!Array.isArray(files) || files.length === 0) return [];
    if (files.length > 10) throw new Error('Maximum 10 images are allowed per request');
    return Promise.all(files.map(f => uploadSingle(f)));
}

module.exports = { uploadSingle, uploadMultiple };
