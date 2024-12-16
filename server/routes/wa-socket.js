import { Router } from 'express';
import {
   sendWASocketStatus,
   requestToReopenWASocket,
   requestToCloseWASocket,
   requestToRestartWASocket,
} from '../controllers/wa-socket.js';

const router = Router();

router.get('/status', sendWASocketStatus);
router.put('/open', requestToReopenWASocket);
router.put('/close', requestToCloseWASocket);
router.put('/restart', requestToRestartWASocket);

export default router;
