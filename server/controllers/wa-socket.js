import { send200Response } from '../../utils/http.js';
import { waSocket, getUptime, openWASocket, closeWASocket } from '../../services/wa.js';
import { sendServiceStatusUpdateNotification } from '../../services/push.js';
import { MsgPayloadTypes } from '../../config/msg.js';

/**
 * Sends WA Socket status
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function sendWASocketStatus(req, res) {
    try {
        const uptime = getUptime();
        const opened = Boolean(waSocket());

        send200Response(res, 'Socket status', { opened, uptime });
    } catch (error) {
        throw new Error("Couldn't get socket status");
    }
}

/**
 * Handles request to open WA Socket connection
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function requestToReopenWASocket(req, res) {
    try {
        if (!waSocket()) {
            await openWASocket();
            sendServiceStatusUpdateNotification(
                MsgPayloadTypes.SOCKET_STATUS_UPDATE,
                true
            );
        }
        send200Response(res, 'Socket opened');
    } catch (error) {
        throw new Error("Coudn't open socket connection");
    }
}

/**
 * Handles request to close WA Socket connection
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function requestToCloseWASocket(req, res) {
    try {
        closeWASocket();
        sendServiceStatusUpdateNotification(MsgPayloadTypes.SOCKET_STATUS_UPDATE, false);
        send200Response(res, 'Socket closed');
    } catch (error) {
        throw new Error("Couldn't close socket connection");
    }
}
