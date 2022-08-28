import { executeQuery } from '../utils/mysql.js';
import { generatePushPayloadSHA256 } from '../utils/common.js';

/**
 * Returns all push subscription records
 * @param {number} [limit]
 * @returns {Promise<PushSubscriptionRecord[]>}
 */
export function getAllPushSubscriptions(limit) {
   return executeQuery('SELECT * FROM push_subs ORDER BY id DESC LIMIT ?;', [
      limit,
   ]);
}

/**
 * Returns all enabled push subscription records
 * @returns {Promise<PushSubscriptionRecord[]>}
 */
export function getEnabledPushSubscriptions() {
   return executeQuery(
      'SELECT * FROM push_subs WHERE enabled = 1 ORDER BY id DESC;'
   );
}

/**
 * Returns push subscription record by given `id`
 * @param {number} id
 * @returns {Promise<PushSubscriptionRecord>}
 */
export function getPushSubscriptionById(id) {
   return executeQuery(
      'SELECT * FROM push_subs WHERE id = ? LIMIT 1;',
      [id],
      false
   );
}

/**
 * Inserts new push subscription record
 * @param {Pick<PushSubscriptionRecord, 'user_agent'|'payload'|'tag'>} data
 */
export function createPushSubscription(data) {
   const sha256 = generatePushPayloadSHA256(data.payload);
   return executeQuery(
      'INSERT INTO push_subs (user_agent, payload, sha256, tag) VALUES (?, ?, ?, ?);',
      [data.user_agent, data.payload, sha256, data.tag]
   );
}

/**
 * Checks whether push subscription record is exists or not by given `sha256`
 * @param {string} sha256
 * @returns {Promise<boolean>}
 */
export async function checkPushSubscriptionBySha256(sha256) {
   const res = await executeQuery(
      'SELECT id FROM push_subs WHERE sha256 = ? LIMIT 1;',
      [sha256]
   );
   return Boolean(res.length);
}

/**
 * Increase rejection count by one by given `id`
 * @param {number} id
 */
export function increaseRejectionCount(id) {
   return executeQuery(
      'UPDATE push_subs SET rejection_count = rejection_count + 1 WHERE id = ? LIMIT 1;',
      [id]
   );
}

/**
 * Decrease rejection count by one by given `id`
 * @param {number} id
 */
export function decreaseRejectionCount(id) {
   return executeQuery(
      'UPDATE push_subs SET rejection_count = rejection_count - 1 WHERE id = ? LIMIT 1;',
      [id]
   );
}

/**
 * Updates push subscription record by given `id`
 * @param {number} id
 * @param {Partial<Pick<PushSubscriptionRecord, 'enabled'>>} data
 */
export function updatePushSubscription(id, data) {
   delete data['id'];
   delete data['user_agent'];
   delete data['payload'];
   delete data['sha256'];
   delete data['tag'];
   delete data['created_at'];

   return executeQuery('UPDATE push_subs SET ? WHERE id = ? LIMIT 1;', [
      data,
      id,
   ]);
}

/**
 * Deletes push subscription record by given `id`
 * @param {number} id
 */
export function deletePushSubscription(id) {
   return executeQuery('DELETE FROM push_subs WHERE id = ? LIMIT 1;', [id]);
}
