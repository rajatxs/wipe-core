import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import debug from 'debug';
import { SQLITE_DB_FILE } from '../../config/config.js';
import { send200Response, send400Response, send500Response } from '../../utils/http.js';

/**
 * Send store file info
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendStoreInfo(req, res) {
    try {
        const stats = await stat(SQLITE_DB_FILE);
        const size = stats.size;

        send200Response(res, 'Store info', {
            size,
            path: SQLITE_DB_FILE,
        });
    } catch (error) {
        debug('wipe:controller:store:error')(error.message);
        send500Response(res, "Couldn't get store size");
    }
}

/**
 * Send store file
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function sendStoreFile(req, res) {
    try {
        const stream = createReadStream(SQLITE_DB_FILE);
        res.setHeader('Content-Type', 'application/vnd.sqlite3');
        stream.pipe(res);
    } catch (error) {
        debug('wipe:controller:store:error')(error.message);
        send500Response(res, "Couldn't stream store file");
    }
}

/**
 * Save new store file at default path
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function downloadStoreFile(req, res) {
    if (req.file) {
        send200Response(res, 'File saved', {
            path: req.file.path,
        });
    } else {
        send400Response(res, 'File not provided');
    }
}
