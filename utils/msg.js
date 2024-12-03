import { encode } from 'msgpackr';
import { MsgPayloadTypes } from '../config/msg.js';

/**
 * Returns encoded presence update notification payload
 * @param {string} alias
 * @param {boolean} status
 */
export function encodePresenceUpdateNotificationPayload(alias, status) {
   /** @type {PresenceNotificationPayload} */
   const payload = [MsgPayloadTypes.PRESENCE_UPDATE, alias, status, Date.now()];
   return encode(payload);
}

/** Returns encoded status added notification payload */
export function encodeStatusAddedNotificationPayload() {
   /** @type {StatusAddedNotificationPayload} */
   const payload = [MsgPayloadTypes.STATUS_ADDED, Date.now()];
   return encode(payload);
}

/**
 * Returns encoded service status update notification payload
 * @param {number} serviceType
 * @param {boolean} status
 */
export function encodeServiceStatusUpdateNotificationPayload(
   serviceType,
   status
) {
   /** @type {ServiceStatusUpdateNotificationPayload} */
   const payload = [
      MsgPayloadTypes.SERVER_STATUS_UPDATE,
      serviceType,
      status,
      Date.now(),
   ];
   return encode(payload);
}
