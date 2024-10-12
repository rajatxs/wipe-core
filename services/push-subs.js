import { getRow, getRows, insertRow, deleteRow } from '../utils/sqlite.js';

/**
 * Returns all push subscription records
 * @param {number} [limit]
 * @returns {Promise<PushSubscriptionRecord[]>}
 */
export function getAllPushSubscriptions(limit) {
    return getRows('SELECT * FROM push_subs_view LIMIT ?;', [limit]);
}

/**
 * Returns all enabled push subscription records
 * @returns {Promise<PushSubscriptionRecord[]>}
 */
export function getEnabledPushSubscriptions() {
    return getRows('SELECT * FROM push_subs_view WHERE enabled = 1;');
}

/**
 * Returns push subscription record by given `id`
 * @param {number} id
 * @returns {Promise<PushSubscriptionRecord>}
 */
export function getPushSubscriptionById(id) {
    return getRow('SELECT * FROM push_subs_view WHERE id = ? LIMIT 1;', [id]);
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
 * @returns {Promise<number>}
 */
export function createPushSubscription(data) {
    return insertRow(
        'INSERT INTO push_subs (user_agent, payload, tag) VALUES (?, ?, ?);',
        [data.user_agent, data.payload, data.tag]
    );
}

/**
 * Deletes push subscription record by given `id`
 * @param {number} id
 * @returns {Promise<number>}
 */
export function deletePushSubscription(id) {
    return deleteRow('DELETE FROM push_subs WHERE id = ?;', [id]);
}
