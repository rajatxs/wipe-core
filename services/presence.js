import { getRow, getRows, insertRow, deleteRow } from '../utils/sqlite.js';

/**
 * Returns presence history record by given `id`
 * @param {number} id
 * @returns {Promise<PresenceHistory>}
 */
export function getPresenceHistoryById(id) {
    return getRow('SELECT * FROM pres_hist_view WHERE id = ? LIMIT 1;', [id]);
}

/**
 * Returns list of presence history record
 * @param {number} subId
 * @param {number} limit
 * @returns {Promise<PresenceHistory[]>}
 */
export function getPresenceHistoryBySubId(subId, limit) {
    return getRows('SELECT * FROM pres_hist_view WHERE sub_id = ? LIMIT ?;', [
        subId,
        limit,
    ]);
}

/**
 * Inserts presence history record
 * @param {Pick<PresenceHistory, 'status'|'lastseen'|'sub_id'|'tag'>} data
 * @returns {Promise<number>}
 */
export function insertPresenceHistoryRecord(data) {
    return insertRow(
        'INSERT INTO pres_hist(status, lastseen, sub_id, tag) VALUES (?, ?, ?, ?);',
        [data.status, data.lastseen, data.sub_id, data.tag]
    );
}

/**
 * Deletes single presence history record by given `id`
 * @param {number} id
 * @returns {Promise<number>}
 */
export function deletePresenceHistoryRecordById(id) {
    return deleteRow('DELETE FROM pres_hist WHERE id = ?;', [id]);
}

/**
 * Deletes all presence history records by given `subId`
 * @param {number} subId
 * @returns {Promise<number>}
 */
export function deletePresenceHistoryRecordBySubId(subId) {
    return deleteRow('DELETE FROM pres_hist WHERE sub_id = ?;', [subId]);
}
