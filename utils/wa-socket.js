import { waSocket } from '../sockets/wa.socket.js';
import { jidEncode } from '@whiskeysockets/baileys/lib/WABinary/jid-utils.js';

/**
 * Registers new subscription of given `subs` based on `event`
 * @param {Subscription} subs
 * @returns {Promise<any>}
 */
export async function registerSocketEventBySubscription(subs) {
   const jid = jidEncode(subs.phone, 's.whatsapp.net');
   let output;

   switch (subs.event) {
      case 'presence.update':
         output = await waSocket().presenceSubscribe(jid);
         break;
   }

   return output;
}
