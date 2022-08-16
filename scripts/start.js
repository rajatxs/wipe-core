import { openWASocket, closeWASocket } from '../sockets/wa.socket.js';
import { startHttpServer, stopHttpServer } from '../server/http.server.js';
import { disconnect } from '../utils/mysql.js';
import { configureWebPush } from '../utils/webpush.js';
import logger from '../utils/logger.js'; 

(async function() {
   configureWebPush();
   await startHttpServer();
   await openWASocket();

   process.on('SIGINT', async () => {
      try {
         closeWASocket();
         await disconnect();
         await stopHttpServer();
      } catch (error) {
         logger.error('server', "couldn't stop server", error);
         return process.exit(1);
      }

      process.exit(0);
   });
}());
