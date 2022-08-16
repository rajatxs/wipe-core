import { getSubscriptions, getSubscriptionByPhone } from './subs.service.js';
import { insertPresenceHistoryRecord } from './presence.service.js';
import { sendPresenceUpdateNotification } from './push.service.js';
import { TAG } from '../config/config.js';
import {
   jidEncode,
   jidDecode,
} from '@adiwajshing/baileys/lib/WABinary/jid-utils.js';
import logger from '../utils/logger.js';

/** @type {Map<string, number>} */
const presenceUpdateCounts = new Map();

/**
 * Increments presence update count by given `jid`
 * @param {string} jid 
 */
export function incrementPresenceUpdateCount(jid) {
   if (!presenceUpdateCounts.has(jid)) {
      presenceUpdateCounts.set(jid, 0);
   } else {
      presenceUpdateCounts.set(jid, presenceUpdateCounts.get(jid) + 1);
   }
}

/** Removes all values from `presenceUpdateCounts`  */
export function resetPresenceUpdateCounts() {
   presenceUpdateCounts.clear();
}

/**
 * Dispatch presence update event
 * @param {object} event 
 * @returns {Promise<any>}
 */
export async function dispatchPresenceUpdateEvent(event) {
   const jid = event.id;
   let props = {},
      status = 0,
      lastseen = 0;

   if (event.presences[jid] && typeof event.presences[jid] === 'object') {
      props = event.presences[jid];
   } else {
      return Promise.resolve();
   }

   incrementPresenceUpdateCount(jid);
   
   if ('lastKnownPresence' in props) {
      // should track available status
      if (props.lastKnownPresence === 'available') {
         status = 1;
      } else {
         // prevent insertion of offline record
         if (presenceUpdateCounts.get(jid) === 0) {
            return Promise.resolve();
         }
      }
   }

   if ('lastSeen' in props && typeof props.lastSeen === 'number') {
      lastseen = props.lastSeen;
   }

   const { user: phone } = jidDecode(jid);
   const subslist = await getSubscriptionByPhone('presence.update', phone);

   let subsPromises = subslist.map(async (subs) => {
      if (subs.enabled === 1) {
         const sub_id = subs.id;
         const res = await insertPresenceHistoryRecord({
            status,
            lastseen,
            sub_id,
            tag: TAG,
         });
   
         if (res.affectedRows > 0) {
            logger.info('observer:service', `presence update sub_id=${sub_id} status=${status}`);
         }
   
         if (subs.notify === 1) {
            return sendPresenceUpdateNotification(subs, status);
         }
      }
      return Promise.resolve();
   });

   return Promise.all(subsPromises);
}

/**
 * Register presence update event
 * @param {any} socket
 * @returns {Promise<any>}
 */
export async function registerPresenceUpdateEvent(socket) {
   const subslist = await getSubscriptions('presence.update', 5);
   let subsPromises = subslist.map(async (subs) => {
      const jid = jidEncode(subs.phone, 's.whatsapp.net');
      await socket.presenceSubscribe(jid);
      logger.info('observer:service', `subscribe event=${subs.event} id=${subs.id}`)
   });

   return Promise.all(subsPromises);
}
