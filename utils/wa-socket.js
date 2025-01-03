import { waSocket } from '../services/wa.js';
import { jidEncode } from '@whiskeysockets/baileys/lib/WABinary/jid-utils.js';

// TODO: Move registerSocketEventBySubscription() to WAService
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
