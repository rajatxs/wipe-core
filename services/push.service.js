import {
   getEnabledPushSubscriptions,
   deletePushSubscription,
   increaseRejectionCount,
   decreaseRejectionCount,
} from './push-subs.service.js';
import { webpush } from '../utils/webpush.js';
import {
   encodePresenceUpdateNotificationPayload,
   encodeServiceStatusUpdateNotificationPayload,
} from '../utils/msg.js';

const ALLOWED_MAX_REJECTION_COUNT = 2;

/**
 * Sends push notification with given `payload`
 * @param {PushSubscriptionRecord} pushsubs
 * @param {Buffer} payload
 */
export async function sendPushNotification(pushsubs, payload) {
   /** @type {import('web-push').SendResult} */
   let result;

   /** @type {object} */
   let subs;

   if (typeof pushsubs.payload !== 'string') {
      await deletePushSubscription(pushsubs.id);
      throw new Error('found invalid payload');
   }

   try {
      subs = JSON.parse(pushsubs.payload);
      result = await webpush().sendNotification(
         subs,
         payload.toString('base64')
      );
   } catch (error) {
      if (pushsubs.rejection_count <= ALLOWED_MAX_REJECTION_COUNT) {
         await increaseRejectionCount(pushsubs.id);
      } else {
         await deletePushSubscription(pushsubs.id);
      }
      throw new Error("Couldn't send push notification");
   }

   if (pushsubs.rejection_count > 0) {
      await decreaseRejectionCount(pushsubs.id);
   }

   return result;
}

/**
 * Sends presence update push notification
 * @param {Subscription} subscription
 * @param {number} status
 */
export async function sendPresenceUpdateNotification(subscription, status) {
   const pushsubs = await getEnabledPushSubscriptions();
   const data = encodePresenceUpdateNotificationPayload(
      subscription.alias,
      Boolean(status)
   );
   const psubsPromises = pushsubs.map((psubs) =>
      sendPushNotification(psubs, data)
   );
   return Promise.all(psubsPromises);
}

/**
 * Sends service update push notification
 * @param {number} serviceType
 * @param {boolean} status
 */
export async function sendServiceStatusUpdateNotification(serviceType, status) {
   const pushsubs = await getEnabledPushSubscriptions();
   const data = encodeServiceStatusUpdateNotificationPayload(
      serviceType,
      status
   );
   const psubsPromises = pushsubs.map((psubs) =>
      sendPushNotification(psubs, data)
   );
   return Promise.all(psubsPromises);
}
