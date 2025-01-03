import { existsSync, mkdirSync } from 'fs';
import debug from 'debug';
import { STORE_ROOT } from '../config/config.js';
import { openWASocket, closeWASocket } from '../services/wa.js';
import { startHttpServer, stopHttpServer } from '../server/server.js';
import { openSQLiteDatabase, closeSQLiteDatabase } from '../utils/sqlite.js';

async function terminate() {
    try {
        await closeSQLiteDatabase();
        closeWASocket();
        await stopHttpServer();
    } catch (error) {
        return process.exit(1);
    }

    process.exit(0);
}

(async function () {
    if (!existsSync(STORE_ROOT)) {
        mkdirSync(STORE_ROOT);
        debug('wipe')('store directory created at %s', STORE_ROOT);
    }

    await openSQLiteDatabase();
    await openWASocket();
    await startHttpServer();

    process.on('SIGINT', terminate);
    process.on('SIGTERM', terminate);
})();
