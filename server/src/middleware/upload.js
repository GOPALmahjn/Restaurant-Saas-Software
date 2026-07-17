import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'restaurant-ar/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }],
  },
});

const modelStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'restaurant-ar/models',
    allowed_formats: ['glb', 'gltf', 'usdz'],
    resource_type: 'raw',
  },
});

export const uploadImages = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

export const uploadModel = multer({
  storage: modelStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(glb|gltf|usdz)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only GLB/GLTF/USDZ model files are allowed'), false);
    }
  },
});

export const uploadLogo = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'restaurant-ar/logos',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
      transformation: [{ width: 400, height: 400, crop: 'limit' }],
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
