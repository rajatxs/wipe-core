import { Router } from 'express';
import {
   sendAllPushSubscriptions,
   sendPushSubscriptionById,
   sendPushSubscriptionCheck,
   addNewPushSubscription,
   deleteSinglePushSubscription,
} from '../controllers/push-subs.controller.js';

const router = Router();

router.get('/', sendAllPushSubscriptions);
router.get('/:id', sendPushSubscriptionById);
router.get('/check/:sha256', sendPushSubscriptionCheck);
router.post('/', addNewPushSubscription);
router.delete('/:id', deleteSinglePushSubscription);

export default router;
