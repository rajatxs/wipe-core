import { Router } from 'express';
import { sendNewAuthToken } from '../controllers/auth.js';

const router = Router();

router.post('/token', sendNewAuthToken);

export default router;
