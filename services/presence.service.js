import { executeQuery } from '../utils/mysql.js';

/**
 * Returns presence history record by given `id`
 * @param {number} id
 * @returns {Promise<PresenceHistory>}
 */
export function getPresenceHistoryById(id) {
   return executeQuery(
      'SELECT * FROM pres_hist WHERE id = ? LIMIT 1;',
      [id],
      false
   );
}

/**
 * Returns list of presence history record
 * @param {number} subId
 * @param {number} limit
 * @returns {Promise<PresenceHistory[]>}
 */
export function getPresenceHistoryBySubId(subId, limit) {
   return executeQuery(
      'SELECT * FROM pres_hist WHERE sub_id = ? ORDER BY id DESC LIMIT ?;',
      [subId, limit]
   );
}

/**
 * Inserts presence history record
 * @param {Pick<PresenceHistory, 'status'|'lastseen'|'sub_id'|'tag'>} data
 */
export function insertPresenceHistoryRecord(data) {
   return executeQuery(
      'INSERT INTO pres_hist(status, lastseen, sub_id, tag) VALUES (?, ?, ?, ?);',
      [data.status, data.lastseen, data.sub_id, data.tag]
   );
}

/**
 * Deletes presence history record by given `id`
 * @param {number} id
 */
export function deletePresenceHistoryRecordById(id) {
   return executeQuery('DELETE FROM pres_hist WHERE id = ? LIMIT 1;', [id]);
}

/**
 * Deletes all presence history records by given `subId`
 * @param {number} subId
 */
export function deletePresenceHistoryRecordBySubId(subId) {
   return executeQuery('DELETE FROM pres_hist WHERE sub_id = ?;', [subId]);
}
