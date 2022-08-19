import { Router } from 'express';
import { send200Response } from '../utils/http.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import authRoutes from './auth.route.js';
import subsRoutes from './subs.route.js';
import presenceRoutes from './presence.route.js';
import pushSubsRoutes from './push-subs.route.js';
import waSocketRoutes from './wa-socket.route.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/subs', authMiddleware, subsRoutes);
router.use('/presence', authMiddleware, presenceRoutes);
router.use('/push-subs', authMiddleware, pushSubsRoutes);
router.use('/wa-socket', authMiddleware, waSocketRoutes);

router.get('/ping', function(req, res) {
   send200Response(res, "Pong!");
});

export default router;
