import { Router } from 'express';
import { sendStoreFile, handleUploadFile } from '../controllers/store.js';

const router = Router();

router.get('/file', sendStoreFile);
router.post('/file', handleUploadFile);

export default router;
