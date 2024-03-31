import { getRow, getRows, insertRow, updateRow, deleteRow } from '../utils/sqlite.js';
import { deletePresenceHistoryRecordBySubId } from './presence.service.js';

/**
 * Returns subscription record by given `id`
 * @param {number} id
 * @returns {Promise<Subscription>}
 */
export function getSubscriptionById(id) {
    return getRow('SELECT * FROM subs WHERE id = ? LIMIT 1;', [id]);
}

/**
 * Returns all subscription
 * @returns {Promise<Subscription[]>}
 */
export function getAllSubscriptions() {
    return getRows('SELECT * FROM subs ORDER BY id DESC;', []);
}

/**
 * Returns list of subscription
 * @param {SubscriptionEvent} event
 * @param {number} limit
 * @returns {Promise<Subscription[]>}
 */
export function getSubscriptions(event, limit = 10) {
    // TODO: Validate function definition
    return getRow(
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
    // TODO: Validate function definition
    return getRows(
        'SELECT * FROM subs WHERE enabled = 1 && event = ? && phone = ?;', 
        [event, phone]
    );
}

/**
 * Inserts subscription record
 * @param {Pick<Subscription, 'alias'|'event'|'phone'|'tag'>} data
 * @returns {Promise<number>}
 */
export function createSubscription(data) {
    return insertRow('INSERT INTO subs(alias, event, phone, tag) VALUES (?, ?, ?, ?);', [
        data.alias,
        data.event,
        data.phone,
        data.tag,
    ]);
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

    let queryArgs = Object.keys(data)
        .map((k) => `${k} = ?`)
        .join(', ');
    let queryParams = Object.values(data);

    return updateRow(`UPDATE subs SET ${queryArgs} WHERE id = ?;`, [...queryParams, id]);
}

/**
 * Deletes subscription record by given `id`
 * @param {number} id
 */
export function deleteSubscription(id) {
    // TODO: Delete related present history records
    return deleteRow('DELETE FROM subs WHERE id = ?;', [id]);
}
