import { Router } from 'express';
import {
    sendAllSubscriptions,
    sendSubscriptionById,
    addNewSubscription,
    updateSubscriptionById,
    deleteSubscriptionById,
} from '../controllers/subs.js';

const router = Router();

router.get('/', sendAllSubscriptions);
router.get('/:id', sendSubscriptionById);
router.post('/', addNewSubscription);
router.put('/:id', updateSubscriptionById);
router.delete('/:id', deleteSubscriptionById);

export default router;
