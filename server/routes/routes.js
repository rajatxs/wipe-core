import { Router } from 'express';
import { join } from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'fs';
import debug from 'debug';
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
        // @ts-ignore
        const dir = dirname(fileURLToPath(import.meta.url));
        const filepath = join(dir, '..', '..', 'package.json');
        const content = readFileSync(filepath, 'utf8');
        const config = JSON.parse(content);

        send200Response(res, 'Ok', {
            mode: NODE_ENV,
            version: config.version,
        });
    } catch (error) {
        debug('wipe:controller')(error.message);
        send500Response(res, "Couldn't get version info");
    }
});

export default router;
