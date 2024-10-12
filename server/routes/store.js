import { Router } from 'express';
import { sendStoreInfo, sendStoreFile, downloadStoreFile } from '../controllers/store.js';
import { upload } from '../../utils/multer.js';

const router = Router();

router.get('/info', sendStoreInfo);
router.get('/file', sendStoreFile);
router.post('/file', upload.single('file'), downloadStoreFile);

export default router;
