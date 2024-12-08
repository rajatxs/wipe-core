import { Subscription } from '../models/Subscription.js';
import { getRow, getRows, insertRow, updateRow, deleteRow } from '../utils/sqlite.js';
import { deletePresenceHistoryRecordBySubId } from './presence.js';

/**
 * Returns subscription record by given `id`
 * @param {number} id
 * @returns {Promise<Subscription|null>}
 */
export async function getSubscriptionById(id) {
    const row = await getRow('SELECT * FROM subs_view WHERE id = ? LIMIT 1;', [id]);
    return row ? Subscription.fromRow(row) : null;
}

/**
 * Returns all subscription
 * @returns {Promise<Subscription[]>}
 */
export async function getAllSubscriptions() {
    const rows = await getRows('SELECT * FROM subs_view;', []);
    return rows.map(Subscription.fromRow);
}

/**
 * Returns list of subscription
 * @param {SubscriptionEvent} event
 * @param {number} limit
 * @returns {Promise<Subscription[]>}
 */
export async function getSubscriptions(event, limit = 10) {
    const rows = await getRows(
        'SELECT * FROM subs_view WHERE enabled = 1 AND event = ? LIMIT ?;',
        [event, limit]
    );
    return rows.map(Subscription.fromRow);
}

/**
 * Returns list of subscription by given `phone`
 * @param {SubscriptionEvent} event
 * @param {string} phone
 * @returns {Promise<Subscription[]>}
 */
export async function getSubscriptionByPhone(event, phone) {
    const rows = await getRows(
        'SELECT * FROM subs_view WHERE enabled = 1 AND event = ? AND phone = ?;',
        [event, phone]
    );
    return rows.map(Subscription.fromRow);
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
export async function deleteSubscription(id) {
    await deletePresenceHistoryRecordBySubId(id);
    return deleteRow('DELETE FROM subs WHERE id = ?;', [id]);
}
