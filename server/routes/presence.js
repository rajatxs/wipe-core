import { Router } from 'express';
import {
    sendPresenceHistoryRecordsById,
    sendPresenceHistoryRecordsBySubId,
    deleteSinglePresenceHistoryRecordById,
    deleteAllPresenceHistoryRecordBySubId,
} from '../controllers/presence.js';

const router = Router();

router.get('/', sendPresenceHistoryRecordsBySubId);
router.get('/:id', sendPresenceHistoryRecordsById);
router.delete('/', deleteAllPresenceHistoryRecordBySubId);
router.delete('/:id', deleteSinglePresenceHistoryRecordById);

export default router;
