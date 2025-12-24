import express from 'express';
import multer from 'multer';
import upload from '../middlewares/upload.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

// Upload image endpoint
router.post('/image', protectRoute, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Cloudinary automatically provides the secure URL in req.file.path
        const imageUrl = req.file.path; // This is the Cloudinary URL
        
        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File is too large. Max size is 5MB' });
        }
        return res.status(400).json({ error: error.message });
    } else if (error) {
        return res.status(400).json({ error: error.message });
    }
    next();
});

export default router;