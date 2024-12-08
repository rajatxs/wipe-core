import { Router } from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import { send200Response, send500Response } from '../../utils/http.js';
import { NODE_ENV } from '../../config/config.js';
import { authMiddleware } from '../middlewares/auth.js';
import authRoutes from './auth.js';
import subsRoutes from './subs.js';
import presenceRoutes from './presence.js';
import pushSubsRoutes from './push-subs.js';
import waSocketRoutes from './wa-socket.js';
import waSessionRoutes from './wa-session.js';
import storeRoutes from './store.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/subs', authMiddleware, subsRoutes);
router.use('/presence', authMiddleware, presenceRoutes);
router.use('/push-subs', authMiddleware, pushSubsRoutes);
router.use('/wa-socket', authMiddleware, waSocketRoutes);
router.use('/wa-session', authMiddleware, waSessionRoutes);
router.use('/store', authMiddleware, storeRoutes);

router.get('/ping', function (req, res) {
    send200Response(res, 'Pong!');
});

router.get('/info', function (req, res) {
    try {
        const content = readFileSync(
            // @ts-ignore
            join(import.meta.dirname, '..', '..', 'package.json'),
            'utf8'
        );
        const config = JSON.parse(content);

        send200Response(res, 'Ok', {
            mode: NODE_ENV,
            version: config.version,
        });
    } catch (error) {
        send500Response(res, "Couldn't get version info");
    }
});

export default router;
