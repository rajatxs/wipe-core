import { executeQuery } from '../utils/mysql.js';
import { generateArchiveSHA256 } from '../utils/session.js';
import { TAG } from '../config/config.js';
import { SESSION_ROOT } from '../config/config.js';
import AdmZip from 'adm-zip';

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
            return reject(
               new Error("Couldn't generate archive from local session")
            );
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
   return executeQuery(
      'INSERT INTO sessions(sha256, archive, tag) VALUES (?, ?, ?);',
      [data.sha256, data.archive, data.tag]
   );
}

/**
 * Returns session record by given `id`
 * @param {number} id
 * @returns {Promise<SessionRecord>}
 */
export function getSessionRecordById(id) {
   return executeQuery(
      'SELECT * FROM sessions WHERE id = ? LIMIT 1;',
      [id],
      false
   );
}

/**
 * Returns session details by given `id`
 * @param {number} id
 * @returns {Promise<Omit<SessionRecord, 'archive'>>}
 */
export function getSessionDetailsById(id) {
   return executeQuery(
      'SELECT id, sha256, tag, created_at FROM sessions WHERE id = ? LIMIT 1;',
      [id],
      false
   );
}

/**
 * Returns all session detail records
 * @param {number} [limit]
 * @returns {Promise<SessionRecord[]>}
 */
export function getAllSessionDetails(limit) {
   return executeQuery(
      'SELECT id, sha256, tag, created_at FROM sessions ORDER BY id DESC LIMIT ?;',
      [limit]
   );
}

/**
 * Returns latest session details
 * @returns {Promise<Omit<SessionRecord, 'archive'>>}
 */
export function getLatestSessionDetails() {
   return executeQuery(
      'SELECT id, sha256, tag, created_at FROM sessions ORDER BY id DESC LIMIT 1;'
   );
}

/**
 * Returns latest archive
 * @returns {Promise<Buffer>}
 */
export async function getLatestArchive() {
   const record = await executeQuery(
      'SELECT archive FROM sessions ORDER BY id DESC LIMIT 1;',
      [],
      false
   );
   return record.archive || null;
}

/**
 * Checks whether session record is exists by given `id` or not
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export async function checkSessionRecordById(id) {
   const res = await executeQuery(
      'SELECT id FROM sessions WHERE id = ? LIMIT 1;',
      [id]
   );
   return Boolean(res.length);
}

/**
 * Checks whether session record is exists by given `sha256` or not
 * @param {string} sha256
 * @returns {Promise<boolean>}
 */
export async function checkSessionRecordBySHA256(sha256) {
   const res = await executeQuery(
      'SELECT id FROM sessions WHERE sha256 = ? LIMIT 1;',
      [sha256]
   );
   return Boolean(res.length);
}

/**
 * Deletes session record by given `id`
 * @param {number} id
 * @returns {Promise<object>}
 */
export function deleteSessionById(id) {
   return executeQuery('DELETE FROM sessions WHERE id = ? LIMIT 1;', [id]);
}
