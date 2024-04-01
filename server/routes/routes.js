import { Router } from 'express';
import { send200Response } from '../../utils/http.js';
import { authMiddleware } from '../middlewares/auth.js';
import authRoutes from './auth.js';
import subsRoutes from './subs.js';
import presenceRoutes from './presence.js';
import pushSubsRoutes from './push-subs.js';
import waSocketRoutes from './wa-socket.js';
import waSessionRoutes from './wa-session.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/subs', authMiddleware, subsRoutes);
router.use('/presence', authMiddleware, presenceRoutes);
router.use('/push-subs', authMiddleware, pushSubsRoutes);
router.use('/wa-socket', authMiddleware, waSocketRoutes);
router.use('/wa-session', authMiddleware, waSessionRoutes);

router.get('/ping', function(req, res) {
   send200Response(res, "Pong!");
});

export default router;
