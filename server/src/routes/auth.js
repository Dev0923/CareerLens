import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

const router = Router();

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.post('/google', AuthController.googleLogin);
router.post('/get-profile', AuthController.getProfile);
router.post('/update-profile', AuthController.updateProfile);
router.post('/delete-account', AuthController.deleteAccount);

export default router;
