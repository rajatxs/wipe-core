import debug from 'debug';
import { jidDecode } from '@whiskeysockets/baileys/lib/WABinary/jid-utils.js';
import { getSubscriptions, getSubscriptionByPhone } from './subs.js';
import { insertPresenceHistoryRecord } from './presence.js';
import { sendWANotification } from './wa.js';
import { TAG } from '../config/config.js';
import { registerSocketEventBySubscription } from '../utils/wa-socket.js';

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
        }
        return Promise.resolve();
    });

    return Promise.all(subsPromises);
}

/** Dispatch status added event */
export async function dispatchStatusAddedEvent() {
    debug('wipe:observer')('status added');
    sendWANotification('new status has been added');
    return Promise.resolve();
}

/**
 * Register presence update event
 * @returns {Promise<any>}
 */
export async function registerPresenceUpdateEvent() {
    const subslist = await getSubscriptions('presence.update', 5);
    let subsPromises = subslist.map(async (subs) => {
        await registerSocketEventBySubscription(subs);
        debug('wipe:observer')('subscribe event=%s id=%d', subs.event, subs.id);
    });

    return Promise.all(subsPromises);
}
