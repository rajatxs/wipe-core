import debug from 'debug';
import { send200Response, send404Response, send500Response } from '../utils/http.js';
import {
    getLatestSessionDetails,
    getSessionDetailsById,
    getAllSessionDetails,
    uploadSession,
    restoreLatestSession,
    deleteSessionById,
} from '../services/session.service.js';

/**
 * Sends details of latest session
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendLatestSessionDetails(req, res) {
    try {
        const session = await getLatestSessionDetails();
        send200Response(res, 'Latest session', session);
    } catch (error) {
        debug('wipe:controller:wa-session:error')(error);
        send500Response(res, "Couldn't get latest session details");
    }
}

/**
 * Sends details of all sessions
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendAllSessionDetails(req, res) {
    const limit = Number(req.query.limit) || 50;

    try {
        const sessions = await getAllSessionDetails(limit);
        send200Response(res, 'All sessions', sessions);
    } catch (error) {
        debug('wipe:controller:wa-session:error')(error);
        send500Response(res, "Couldn't get sessions");
    }
}

/**
 * Sends details of session by given `id`
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendSessionDetailsByGivenId(req, res) {
    const id = Number(req.params.id);

    try {
        const session = await getSessionDetailsById(id);

        if (session) {
            send200Response(res, 'Session record', session);
        } else {
            send404Response(res, 'Session not found');
        }
    } catch (error) {
        debug('wipe:controller:wa-session:error')(error);
        send500Response(res, "Couldn't get session");
    }
}

/**
 * Handles request to upload current session
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function requestToUploadSession(req, res) {
    try {
        await uploadSession(req.locals.tag);
        send200Response(res, 'Session uploaded');
    } catch (error) {
        debug('wipe:controller:wa-session:error')(error);
        send500Response(res, "Couldn't upload session");
    }
}

/**
 * Handles request to restore session
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function requestToRestoreSession(req, res) {
    try {
        await restoreLatestSession();
        send200Response(res, 'Session restored');
    } catch (error) {
        debug('wipe:controller:wa-session:error')(error);
        send500Response(res, "Couldn't restore session");
    }
}

/**
 * Deletes single session record by given id
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function deleteSingleSessionRecordById(req, res) {
    const id = Number(req.params.id);

    try {
        const result = await deleteSessionById(id);
        send200Response(res, 'Session deleted', result);
    } catch (error) {
        debug('wipe:controller:wa-session:error')(error);
        send500Response(res, "Couldn't delete session");
    }
}
