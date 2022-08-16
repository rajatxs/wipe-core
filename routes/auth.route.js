import { Router } from 'express';
import { sendNewAuthToken } from '../controllers/auth.controller.js';

const router = Router();

router.post('/token', sendNewAuthToken);

export default router;
