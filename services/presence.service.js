import { mysql } from '../utils/mysql.js';

/**
 * Returns presence history record by given `id`
 * @param {number} id 
 * @returns {Promise<PresenceHistory>}
 */
export function getPresenceHistoryById(id) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'SELECT * FROM pres_hist WHERE id = ? LIMIT 1;',
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
 * Returns list of presence history record
 * @param {number} subId
 * @param {number} limit
 * @returns {Promise<PresenceHistory[]>}
 */
export function getPresenceHistoryBySubId(subId, limit) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'SELECT * FROM pres_hist WHERE sub_id = ? ORDER BY id DESC LIMIT ?;',
         [subId, limit],
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
 * Inserts presence history record
 * @param {Pick<PresenceHistory, 'status'|'lastseen'|'sub_id'|'tag'>} data
 */
export function insertPresenceHistoryRecord(data) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'INSERT INTO pres_hist(status, lastseen, sub_id, tag) VALUES (?, ?, ?, ?);',
         [data.status, data.lastseen, data.sub_id, data.tag],
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
 * Deletes presence history record by given `id`
 * @param {number} id 
 */
export function deletePresenceHistoryRecordById(id) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'DELETE FROM pres_hist WHERE id = ? LIMIT 1;',
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

/**
 * Deletes all presence history records by given `subId`
 * @param {number} subId 
 */
export function deletePresenceHistoryRecordBySubId(subId) {
   return new Promise((resolve, reject) => {
      mysql().query(
         'DELETE FROM pres_hist WHERE sub_id = ?;',
         [subId],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res);
         }
      );
   });
}
