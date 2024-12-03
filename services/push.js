import { getPushSubscriptionPayloadList } from './push-subs.js';
import { webpush } from '../utils/webpush.js';
import {
   encodePresenceUpdateNotificationPayload,
   encodeStatusAddedNotificationPayload,
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

/** Sends status added push notification */
export async function sendStatusAddedNotification() {
   const payloadList = await getPushSubscriptionPayloadList();
   const psubsPromises = payloadList.map(function (pushpayload) {
      const data = encodeStatusAddedNotificationPayload();
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
