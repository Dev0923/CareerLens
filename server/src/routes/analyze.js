import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AnalyzeController } from '../controllers/analyzeController.js';

const router = Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}
const upload = multer({ dest: uploadsDir });

router.post('/extract-pdf', upload.single('resume'), AnalyzeController.extract);
router.post('/run', AnalyzeController.analyze);
router.post('/skill-gap', AnalyzeController.skillGap);
router.post('/career-roadmap', AnalyzeController.careerRoadmap);

export default router;
