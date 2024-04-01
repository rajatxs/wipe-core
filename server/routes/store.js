import { Router } from 'express';
import { sendStoreInfo, sendStoreFile } from '../controllers/store.js';

const router = Router();

router.get('/info', sendStoreInfo);
router.get('/file', sendStoreFile);

export default router;
