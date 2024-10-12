import { Router } from 'express';
import {
   sendWASocketStatus,
   requestToReopenWASocket,
   requestToCloseWASocket,
} from '../controllers/wa-socket.js';

const router = Router();

router.get('/status', sendWASocketStatus);
router.put('/open', requestToReopenWASocket);
router.put('/close', requestToCloseWASocket);

export default router;
