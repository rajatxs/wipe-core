import debug from 'debug';
import fs from 'fs';
import { join } from 'path';
import { SQLITE_DB_FILE, UPLOAD_ROOT } from '../../config/config.js';
import { send200Response, send500Response } from '../../utils/http.js';

/**
 * Send store file
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function sendStoreFile(req, res) {
    try {
        const stream = fs.createReadStream(SQLITE_DB_FILE);
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
export function handleUploadFile(req, res) {
    if (!fs.existsSync(UPLOAD_ROOT)) {
        fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
    }

    const filename = `file_${Date.now()}`;
    const writer = fs.createWriteStream(join(UPLOAD_ROOT, filename));

    req.pipe(writer).on('close', function () {
        send200Response(res, 'File saved');
    });
}
