import { getPushSubscriptionPayloadList } from './push-subs.service.js';
import { webpush } from '../utils/webpush.js';
import {
   encodePresenceUpdateNotificationPayload,
   encodeServiceStatusUpdateNotificationPayload,
} from '../utils/msg.js';

/**
 * Sends presence update push notification
 * @param {Subscription} subscription
 * @param {number} status
 */
export async function sendPresenceUpdateNotification(subscription, status) {
   const payloadList = await getPushSubscriptionPayloadList();
   const psubsPromises = payloadList.map(function (pushpayload) {
      const data = encodePresenceUpdateNotificationPayload(
         subscription.alias,
         Boolean(status)
      );
      return webpush().sendNotification(pushpayload, data.toString('base64'));
   });

   return Promise.all(psubsPromises);
}

/**
 * Sends service update push notification
 * @param {number} serviceType
 * @param {boolean} status
 */
export async function sendServiceStatusUpdateNotification(serviceType, status) {
   const payloadList = await getPushSubscriptionPayloadList();
   const psubsPromises = payloadList.map(function (pushpayload) {
      const data = encodeServiceStatusUpdateNotificationPayload(
         serviceType,
         status
      );
      return webpush().sendNotification(pushpayload, data.toString('base64'));
   });
   return Promise.all(psubsPromises);
}
