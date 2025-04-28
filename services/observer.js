import debug from 'debug';
import { jidDecode } from 'baileys/lib/WABinary/jid-utils.js';
import { getSubscriptions, getSubscriptionByPhone } from './subs.js';
import { insertPresenceHistoryRecord } from './presence.js';
import { sendWANotification, registerWAEventBySubscription } from './wa.js';
import { TAG } from '../config.js';

/** @type {Map<string, number>} */
const presenceUpdateCounts = new Map();

/**
 * Increments presence update count by given `jid`
 * @param {string} jid
 */
export function incrementPresenceUpdateCount(jid) {
    if (!presenceUpdateCounts.has(jid)) {
        presenceUpdateCounts.set(jid, 0);
    } else {
        presenceUpdateCounts.set(jid, presenceUpdateCounts.get(jid) + 1);
    }
}

/** Removes all values from `presenceUpdateCounts`  */
export function resetPresenceUpdateCounts() {
    presenceUpdateCounts.clear();
}

/**
 * Dispatch presence update event
 * @param {object} event
 * @returns {Promise<any>}
 */
export async function dispatchPresenceUpdateEvent(event) {
    const jid = event.id;
    let props = {},
        status = 0,
        lastseen = 0;

    if (event.presences[jid] && typeof event.presences[jid] === 'object') {
        props = event.presences[jid];
    } else {
        return Promise.resolve();
    }

    incrementPresenceUpdateCount(jid);

    if ('lastKnownPresence' in props) {
        // should track available status
        if (props.lastKnownPresence === 'available') {
            status = 1;
        } else {
            // prevent insertion of offline record
            if (presenceUpdateCounts.get(jid) === 0) {
                return Promise.resolve();
            }
        }
    }

    if ('lastSeen' in props && typeof props.lastSeen === 'number') {
        lastseen = props.lastSeen;
    }

    const { user: phone } = jidDecode(jid);
    const subslist = await getSubscriptionByPhone('presence.update', phone);

    let subsPromises = subslist.map(async (subs) => {
        if (subs.enabled === 1) {
            // insert presence history record
            const sub_id = subs.id;
            const recordId = await insertPresenceHistoryRecord({
                status,
                lastseen,
                sub_id,
                tag: TAG,
            });

            if (recordId > 0) {
                debug('wipe:observer')(
                    'presence update sub_id=%d status=%d',
                    sub_id,
                    status
                );
            }

            // send presence notification
            if (subs.notify === 1) {
                const msg = `${subs.alias} is ${status === 1 ? 'online' : 'offline'}`;
                await sendWANotification(msg);
            }
        }
        return Promise.resolve();
    });

    return Promise.all(subsPromises);
}

/**
 * Dispatch status added event
 * @returns {Promise<void>}
 */
export async function dispatchStatusAddedEvent() {
    debug('wipe:observer')('status added');
    await sendWANotification('new status has been added');
    return Promise.resolve();
}

/**
 * Dispatch contacts updated event
 * @returns {Promise<void>}
 */
export async function dispatchContactsUpdatedEvent() {
    debug('wipe:observer')('contacts updated');
    await sendWANotification('Contacts have been updated.');
    return Promise.resolve();
}

/**
 * Register presence update event
 * @returns {Promise<any>}
 */
export async function registerPresenceUpdateEvent() {
    const subslist = await getSubscriptions('presence.update');
    let subsPromises = subslist.map(async (subs) => {
        await registerWAEventBySubscription(subs);
        debug('wipe:observer')('subscribe event=%s id=%d', subs.event, subs.id);
    });

    return Promise.all(subsPromises);
}
