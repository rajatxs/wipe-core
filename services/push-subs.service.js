import { mysql } from '../utils/mysql.js';

/**
 * Returns all push subscription records
 * @param {number} [limit]
 * @returns {Promise<PushSubscriptionRecord[]>}
 */
export function getAllPushSubscriptions(limit) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'SELECT * FROM push_subs ORDER BY id DESC LIMIT ?;',
         [limit],
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
 * Returns all enabled push subscription records
 * @returns {Promise<PushSubscriptionRecord[]>}
 */
export function getEnabledPushSubscriptions() {
   return new Promise((resolve, reject) => {
      mysql().query(
         'SELECT * FROM push_subs WHERE enabled = 1 ORDER BY id DESC;',
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
 * Returns push subscription record by given `id`
 * @param {number} id
 * @returns {Promise<PushSubscriptionRecord>}
 */
export function getPushSubscriptionById(id) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'SELECT * FROM push_subs WHERE id = ? LIMIT 1;',
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
 * Returns enabled push subscription payload list
 * @returns {Promise<object[]>}
 */
export async function getPushSubscriptionPayloadList() {
   const pushsubs = await getEnabledPushSubscriptions();
   return pushsubs.map(function (subs) {
      return JSON.parse(String(subs.payload));
   });
}

/**
 * Inserts new push subscription record
 * @param {Pick<PushSubscriptionRecord, 'user_agent'|'payload'|'tag'>} data
 */
export function createPushSubscription(data) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'INSERT INTO push_subs (user_agent, payload, tag) VALUES (?, ?, ?);',
         [data.user_agent, data.payload, data.tag],
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
 * Updates push subscription record by given `id`
 * @param {number} id
 * @param {Partial<Pick<PushSubscriptionRecord, 'enabled'|'payload'>>} data
 */
export function updatePushSubscription(id, data) {
   return new Promise((resolve, reject) => {
      delete data['id'];
      delete data['user_agent'];
      delete data['tag'];
      delete data['created_at'];

      mysql().query(
         'UPDATE push_subs SET ? WHERE id = ? LIMIT 1',
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
 * Deletes push subscription record by given `id`
 * @param {number} id
 */
export function deletePushSubscription(id) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'DELETE FROM push_subs WHERE id = ? LIMIT 1;',
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
