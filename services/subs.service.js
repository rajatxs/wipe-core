import { mysql } from '../utils/mysql.js';

/**
 * Returns subscription record by given `id`
 * @param {number} id
 * @returns {Promise<Subscription>}
 */
export function getSubscriptionById(id) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'SELECT * FROM subs WHERE id = ? LIMIT 1;',
         [id],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res[0]);
         }
      );
   });
}

/**
 * Returns all subscription
 * @returns {Promise<Subscription[]>}
 */
export function getAllSubscriptions() {
   return new Promise((resolve, reject) => {
      mysql().query(
         'SELECT * FROM subs ORDER BY id DESC;',
         [],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res);
         }
      );
   });
}

/**
 * Returns list of subscription
 * @param {SubscriptionEvent} event
 * @param {number} limit
 * @returns {Promise<Subscription[]>}
 */
export function getSubscriptions(event, limit = 10) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'SELECT * FROM subs WHERE enabled = 1 && event = ? LIMIT ?;',
         [event, limit],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res);
         }
      );
   });
}

/**
 * Returns list of subscription by given `phone`
 * @param {SubscriptionEvent} event
 * @param {string} phone
 * @returns {Promise<Subscription[]>}
 */
export function getSubscriptionByPhone(event, phone) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'SELECT * FROM subs WHERE enabled = 1 && event = ? && phone = ?;',
         [event, phone],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res);
         }
      );
   });
}

/**
 * Inserts subscription record
 * @param {Pick<Subscription, 'alias'|'event'|'phone'|'tag'>} data
 */
export function createSubscription(data) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'INSERT INTO subs(alias, event, phone, tag) VALUES (?, ?, ?, ?);',
         [data.alias, data.event, data.phone, data.tag],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res);
         }
      );
   });
}

/**
 * Updates subscription record by given `id`
 * @param {number} id
 * @param {Partial<Pick<Subscription, 'alias'|'enabled'|'notify'>>} data
 */
export function updateSubscription(id, data) {
   return new Promise((resolve, reject) => {
      delete data['id'];
      delete data['event'];
      delete data['phone'];
      delete data['tag'];
      delete data['created_at'];

      mysql().query(
         'UPDATE subs SET ? WHERE id = ? LIMIT 1',
         [data, id],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res);
         }
      );
   });
}

/**
 * Deletes subscription record by given `id`
 * @param {number} id
 */
export function deleteSubscription(id) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'DELETE FROM subs WHERE id = ? LIMIT 1;',
         [id],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res);
         }
      );
   });
}
