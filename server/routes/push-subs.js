import { Router } from 'express';
import {
   sendAllPushSubscriptions,
   sendPushSubscriptionById,
   addNewPushSubscription,
   deleteSinglePushSubscription,
} from '../controllers/push-subs.js';

const router = Router();

router.get('/', sendAllPushSubscriptions);
router.get('/:id', sendPushSubscriptionById);
router.post('/', addNewPushSubscription);
router.delete('/:id', deleteSinglePushSubscription);

export default router;
