import { executeQuery } from '../utils/mysql.js';
import { deletePresenceHistoryRecordBySubId } from './presence.service.js';

/**
 * Returns subscription record by given `id`
 * @param {number} id
 * @returns {Promise<Subscription>}
 */
export function getSubscriptionById(id) {
   return executeQuery('SELECT * FROM subs WHERE id = ? LIMIT 1;', [id], false);
}

/**
 * Returns all subscription
 * @returns {Promise<Subscription[]>}
 */
export function getAllSubscriptions() {
   return executeQuery('SELECT * FROM subs ORDER BY id DESC;');
}

/**
 * Returns list of subscription
 * @param {SubscriptionEvent} event
 * @param {number} limit
 * @returns {Promise<Subscription[]>}
 */
export function getSubscriptions(event, limit = 10) {
   return executeQuery(
      'SELECT * FROM subs WHERE enabled = 1 && event = ? LIMIT ?;',
      [event, limit]
   );
}

/**
 * Returns list of subscription by given `phone`
 * @param {SubscriptionEvent} event
 * @param {string} phone
 * @returns {Promise<Subscription[]>}
 */
export function getSubscriptionByPhone(event, phone) {
   return executeQuery(
      'SELECT * FROM subs WHERE enabled = 1 && event = ? && phone = ?;',
      [event, phone]
   );
}

/**
 * Inserts subscription record
 * @param {Pick<Subscription, 'alias'|'event'|'phone'|'tag'>} data
 */
export function createSubscription(data) {
   return executeQuery(
      'INSERT INTO subs(alias, event, phone, tag) VALUES (?, ?, ?, ?);',
      [data.alias, data.event, data.phone, data.tag]
   );
}

/**
 * Updates subscription record by given `id`
 * @param {number} id
 * @param {Partial<Pick<Subscription, 'alias'|'enabled'|'notify'>>} data
 */
export function updateSubscription(id, data) {
   delete data['id'];
   delete data['event'];
   delete data['phone'];
   delete data['tag'];
   delete data['created_at'];

   return executeQuery('UPDATE subs SET ? WHERE id = ? LIMIT 1', [data, id]);
}

/**
 * Deletes subscription record by given `id`
 * @param {number} id
 */
export async function deleteSubscription(id) {
   await deletePresenceHistoryRecordBySubId(id);
   return executeQuery('DELETE FROM subs WHERE id = ? LIMIT 1;', [id]);
}
