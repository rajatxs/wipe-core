import { Router } from 'express';
import {
   sendPushSubscriptionById,
   addNewPushSubscription,
   deleteSinglePushSubscription,
} from '../controllers/push-subs.controller.js';

const router = Router();

router.get('/:id', sendPushSubscriptionById);
router.post('/', addNewPushSubscription);
router.delete('/:id', deleteSinglePushSubscription);

export default router;
