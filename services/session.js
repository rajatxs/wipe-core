import AdmZip from 'adm-zip';
import { TAG } from '../config/config.js';
import { SESSION_ROOT } from '../config/config.js';
import { getRow, getRows, insertRow, deleteRow } from '../utils/sqlite.js';
import { generateArchiveSHA256 } from '../utils/session.js';

/**
 * Generates archive from session and uploads to a database
 * @param {string} [tag]
 * @returns {Promise<object>}
 */
export function uploadSession(tag = TAG) {
    return new Promise(function (resolve, reject) {
        const zip = new AdmZip();

        zip.addLocalFolderAsync(SESSION_ROOT, async function (success, err) {
            if (err) {
                return reject(err);
            }

            if (!success) {
                return reject(new Error("Couldn't generate archive from local session"));
            }

            try {
                const archive = await zip.toBufferPromise();
                const sha256 = generateArchiveSHA256(archive);

                // check for duplication
                if (await checkSessionRecordBySHA256(sha256)) {
                    return reject(
                        new Error(`found duplicated entry ...${sha256.slice(-6)}`)
                    );
                }

                const result = await insertSessionRecord({
                    sha256,
                    archive,
                    tag,
                });

                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    });
}

export function restoreLatestSession() {
    return new Promise(function (resolve, reject) {
        /** @type {AdmZip} */
        let zip;

        getLatestArchive()
            .then(function (archive) {
                if (!archive) {
                    return reject(new Error('archive not found'));
                }

                zip = new AdmZip(archive);
                zip.extractAllToAsync(SESSION_ROOT, true, false, function (err) {
                    if (err) {
                        return reject(err);
                    }

                    resolve();
                });
            })
            .catch(reject);
    });
}

/**
 * Inserts new session record into table
 * @param {SessionRecord} data
 */
export function insertSessionRecord(data) {
    return insertRow('INSERT INTO sessions(sha256, archive, tag) VALUES (?, ?, ?);', [
        data.sha256,
        data.archive,
        data.tag,
    ]);
}

/**
 * Returns session record by given `id`
 * @param {number} id
 * @returns {Promise<SessionRecord>}
 */
export function getSessionRecordById(id) {
    return getRow('SELECT * FROM sessions WHERE id = ? LIMIT 1;', [id]);
}

/**
 * Returns session details by given `id`
 * @param {number} id
 * @returns {Promise<SessionDetail>}
 */
export function getSessionDetailsById(id) {
    return getRow(
        'SELECT id, sha256, tag, created_at FROM sessions WHERE id = ? LIMIT 1;',
        [id]
    );
}

/**
 * Returns all session detail records
 * @param {number} [limit]
 * @returns {Promise<SessionDetail[]>}
 */
export function getAllSessionDetails(limit) {
    return getRows(
        'SELECT id, sha256, tag, created_at FROM sessions ORDER BY id DESC LIMIT ?;',
        [limit]
    );
}

/**
 * Returns latest session details
 * @returns {Promise<SessionDetail>}
 */
export function getLatestSessionDetails() {
    return getRow(
        'SELECT id, sha256, tag, created_at FROM sessions ORDER BY id DESC LIMIT 1;'
    );
}

/**
 * Returns latest archive
 * @returns {Promise<Buffer|null>}
 */
export async function getLatestArchive() {
    const row = await getRow('SELECT archive FROM sessions ORDER BY id DESC LIMIT 1;');

    if (row && row.archive) {
        return row.archive;
    } else {
        return null;
    }
}

/**
 * Checks whether session record is exists by given `id` or not
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export async function checkSessionRecordById(id) {
    const row = await getRow(
        'SELECT COUNT(id) as count FROM sessions WHERE id = ? LIMIT 1;',
        [id]
    );
    return row.count > 0;
}

/**
 * Checks whether session record is exists by given `sha256` or not
 * @param {string} sha256
 * @returns {Promise<boolean>}
 */
export async function checkSessionRecordBySHA256(sha256) {
    const row = await getRow(
        'SELECT COUNT(id) as count FROM sessions WHERE sha256 = ? LIMIT 1;',
        [sha256]
    );
    return row.count > 0;
}

/**
 * Deletes session record by given `id`
 * @param {number} id
 * @returns {Promise<number>}
 */
export function deleteSessionById(id) {
    return deleteRow('DELETE FROM sessions WHERE id = ?;', [id]);
}
