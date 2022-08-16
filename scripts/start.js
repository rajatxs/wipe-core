import { openWASocket, closeWASocket } from '../sockets/wa.socket.js';
import { startHttpServer, stopHttpServer } from '../server/http.server.js';
import { disconnect } from '../utils/mysql.js';
import { configureWebPush } from '../utils/webpush.js';

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
         console.log("Couldn't stop observer service", error);
         return process.exit(1);
      }

      process.exit(0);
   });
}());
