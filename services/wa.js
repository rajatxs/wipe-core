import debug from 'debug';
import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { SESSION_ROOT } from '../config/config.js';
import {
    registerPresenceUpdateEvent,
    dispatchPresenceUpdateEvent,
    dispatchStatusAddedEvent,
    resetPresenceUpdateCounts,
} from './observer.js';

/** @type {any} */
const msgRetryCounterMap = {};
var _waSocket;

/** @type {Date|null} */
var uptime = null;

export function getUptime() {
    return uptime;
}

export function waSocket() {
    return _waSocket;
}

export async function openWASocket() {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_ROOT);
    const { version } = await fetchLatestBaileysVersion();

    // @ts-ignore
    _waSocket = makeWASocket.default({
        version,
        printQRInTerminal: true,
        auth: state,
        msgRetryCounterMap,
    });

    _waSocket.ev.process(async (events) => {
        if (events['connection.update']) {
            const update = events['connection.update'];
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                resetPresenceUpdateCounts();
                if (
                    lastDisconnect.error &&
                    // @ts-ignore
                    lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                ) {
                    openWASocket();
                } else {
                    uptime = null;
                    debug('wipe:wa')('connection closed');
                }
            }

            if (connection === 'open') {
                try {
                    await registerPresenceUpdateEvent();
                    uptime = new Date();
                } catch (error) {
                    debug('wipe:wa:error')(
                        "couldn't subscribe socket events error=%s",
                        error.message
                    );
                }
            }
        }

        if (events['creds.update']) {
            await saveCreds();
        }

        if (events['presence.update']) {
            const event = events['presence.update'];
            await dispatchPresenceUpdateEvent(event);
        }

        if (events['chats.update'] && Array.isArray(events['chats.update'])) {
            const list = events['chats.update'];
            const statusFlag = list.some(function (item) {
                return (
                    typeof item.id === 'string' && item.id.includes('status@broadcast')
                );
            });

            if (statusFlag) {
                await dispatchStatusAddedEvent();
            }
        }
    });

    return _waSocket;
}

export function closeWASocket() {
    if (_waSocket) {
        _waSocket.end(null);
        _waSocket = null;
    }
}
