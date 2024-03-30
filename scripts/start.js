import { existsSync, mkdirSync } from 'fs';
import { STORE_ROOT } from '../config/config.js';
import { openWASocket, closeWASocket } from '../sockets/wa.socket.js';
import { startHttpServer, stopHttpServer } from '../server/http.server.js';
import { openSQLiteDatabase, closeSQLiteDatabase } from '../utils/sqlite.js';
import { configureWebPush } from '../utils/webpush.js';
import debug from 'debug'; 

async function terminate() {
   try {
      // closeWASocket();
      await closeSQLiteDatabase();
      await stopHttpServer();
   } catch (error) {
      return process.exit(1);
   }

   process.exit(0);
}

(async function() {
   if (!existsSync(STORE_ROOT)) {
      mkdirSync(STORE_ROOT);
      debug('wipe')('store directory created at %s', STORE_ROOT);
   }

   configureWebPush();
   await openSQLiteDatabase();
   await startHttpServer();
   // await openWASocket();

   process.on('SIGINT', terminate);
   process.on('SIGTERM', terminate);
}());
