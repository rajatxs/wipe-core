import { Router } from 'express';
import {
   sendAllSessionDetails,
   sendSessionDetailsByGivenId,
   requestToUploadSession,
   requestToRestoreSession,
   deleteSingleSessionRecordById,
} from '../controllers/wa-session.controller.js';

const router = Router();

router.get('/', sendAllSessionDetails);
router.get('/:id', sendSessionDetailsByGivenId);
router.put('/upload', requestToUploadSession);
router.put('/restore', requestToRestoreSession);
router.delete('/:id', deleteSingleSessionRecordById);

export default router;
