import { getEnabledPushSubscriptions } from './push-subs.service.js';
import { webpush } from '../utils/webpush.js';

/**
 * Sends presence update push notification
 * @param {Subscription} subscription 
 * @param {number} status 
 */
export async function sendPresenceUpdateNotification(subscription, status) {
   const pushsubs = await getEnabledPushSubscriptions();
   const psubsPromises = pushsubs.map(function(psubs) {
      const subs = JSON.parse(String(psubs.payload));
      return webpush()
         .sendNotification(
            subs, 
            `${subscription.alias} is ${status === 1? 'online': 'offline'}`,
         );
   });

   return Promise.all(psubsPromises);
}
