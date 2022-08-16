import makeWASocket, {
   DisconnectReason,
   fetchLatestBaileysVersion,
   useMultiFileAuthState,
} from '@adiwajshing/baileys';
import { SESSION_ROOT } from '../config/config.js';
import {
   registerPresenceUpdateEvent,
   dispatchPresenceUpdateEvent,
   resetPresenceUpdateCounts,
} from '../services/observer.service.js';

/** @type {import('@adiwajshing/baileys').MessageRetryMap} */
const msgRetryCounterMap = {};
var waSocket;

export async function openWASocket() {
   const { state, saveCreds } = await useMultiFileAuthState(SESSION_ROOT);
   const { version } = await fetchLatestBaileysVersion();

   // @ts-ignore
   waSocket = makeWASocket.default({
      version,
      printQRInTerminal: true,
      auth: state,
      msgRetryCounterMap,
   });

   waSocket.ev.process(async (events) => {
      if (events['connection.update']) {
         const update = events['connection.update'];
         const { connection, lastDisconnect } = update;
         if (connection === 'close') {
            resetPresenceUpdateCounts();
            if (
               lastDisconnect.error && 
               // @ts-ignore
               lastDisconnect.error.output.statusCode !==
               DisconnectReason.loggedOut
            ) {
               openWASocket();
            } else {
               console.log("'Connection closed. You are logged out.");
            }
         }

         if (connection === 'open') {
            try {
               await registerPresenceUpdateEvent(waSocket);
            } catch (error) {
               console.error("Couldn't get presence", error);
            }
         }
      }

      if (events['creds.update']) {
         await saveCreds();
      }

      if (events['presence.update']) {
         const event = events['presence.update'];
         await dispatchPresenceUpdateEvent(event);
      }
   });

   return waSocket;
}

export function closeWASocket() {
   if (waSocket) {
      waSocket.end(null);
   }
}
