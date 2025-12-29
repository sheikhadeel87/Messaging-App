import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Check if Cloudinary credentials are configured
const hasCloudinaryCredentials = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

// Log Cloudinary status (only once)
if (hasCloudinaryCredentials) {
    console.log('✅ Cloudinary configured for image uploads');
} else {
    console.log('ℹ️  Cloudinary not configured - image uploads disabled');
}

// Configure Cloudinary only if credentials are available
if (hasCloudinaryCredentials) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

// Configure Cloudinary storage with error handling
let storage;
try {
    storage = hasCloudinaryCredentials ? new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'messaging-app',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        }
    }) : multer.memoryStorage(); // Fallback to memory storage if no credentials
} catch (error) {
    console.error('Error configuring Cloudinary storage:', error);
    storage = multer.memoryStorage(); // Fallback
}

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
    }
};

// Multer configuration with Cloudinary
const upload = multer({ 
    storage,
    fileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload;