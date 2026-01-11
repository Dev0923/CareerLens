import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AuthController } from '../controllers/authController.js';

const router = Router();

// Configure multer for file uploads
const uploadsDir = path.resolve(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const username = (req.body.username || 'user').replace(/[^a-z0-9]/gi, '_');
    const fileType = file.fieldname === 'profileImage' ? 'profile' : 'banner';
    const ext = path.extname(file.originalname);
    cb(null, `${username}-${fileType}-${Date.now()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.post('/google', AuthController.googleLogin);
router.post('/get-profile', AuthController.getProfile);
router.post('/update-profile', upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'bannerImage', maxCount: 1 }]), AuthController.updateProfile);
router.post('/delete-account', AuthController.deleteAccount);

export default router;

