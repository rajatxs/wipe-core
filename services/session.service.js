import { mysql } from '../utils/mysql.js';
import { generateArchiveSHA256 } from '../utils/session.js';
import { TAG } from '../config/config.js';
import { SESSION_ROOT } from '../config/config.js';
import AdmZip from 'adm-zip';

/**
 * Generates archive from session and uploads to a database
 * @returns {Promise<object>}
 */
export function uploadSession() {
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
            const tag = TAG;

            // check for duplication
            if (await checkSessionRecordBySHA256(sha256)) {
               return reject(new Error(`found duplicated entry ...${sha256.slice(-6)}`));
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
   return new Promise(function (resolve, reject) {
      mysql().query(
         'INSERT INTO sessions(sha256, archive, tag) VALUES (?, ?, ?);',
         [data.sha256, data.archive, data.tag],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res);
         }
      );
   });
}

/**
 * Returns session record by given `id`
 * @param {number} id
 * @returns {Promise<SessionRecord>}
 */
export function getSessionRecordById(id) {
   return new Promise(function (resolve, reject) {
      mysql().query(
         'SELECT * FROM sessions WHERE id = ? LIMIT 1;',
         [id],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res[0]);
         }
      );
   });
}

/**
 * Returns session details by given `id`
 * @param {number} id 
 * @returns {Promise<Omit<SessionRecord, 'archive'>>}
 */
export function getSessionDetailsById(id) {
   return new Promise(function (resolve, reject) {
      mysql().query(
         'SELECT id, sha256, tag, created_at FROM sessions WHERE id = ? LIMIT 1;',
         [id],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res[0]);
         }
      );
   });
}

/**
 * Returns all session detail records
 * @param {number} [limit]
 * @returns {Promise<SessionRecord[]>}
 */
export function getAllSessionDetails(limit) {
   return new Promise(function (resolve, reject) {
      mysql().query(
         'SELECT id, sha256, tag, created_at FROM sessions ORDER BY id DESC LIMIT ?;',
         [limit],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res);
         }
      );
   });
}

/**
 * Returns latest session details
 * @returns {Promise<Omit<SessionRecord, 'archive'>>}
 */
export function getLatestSessionDetails() {
   return new Promise(function (resolve, reject) {
      mysql().query(
         'SELECT id, sha256, tag, created_at FROM sessions ORDER BY id DESC LIMIT 1;',
         [],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res[0]);
         }
      );
   });
}

/**
 * Returns latest archive
 * @returns {Promise<Buffer>}
 */
export function getLatestArchive() {
   return new Promise(function (resolve, reject) {
      mysql().query(
         'SELECT archive FROM sessions ORDER BY id DESC LIMIT 1;',
         [],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res[0] ? res[0].archive : null);
         }
      );
   });
}

/**
 * Checks whether session record is exists by given `id` or not
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export function checkSessionRecordById(id) {
   return new Promise(function (resolve, reject) {
      mysql().query(
         'SELECT id FROM sessions WHERE id = ? LIMIT 1;',
         [id],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(Boolean(res.length));
         }
      );
   });
}

/**
 * Checks whether session record is exists by given `sha256` or not
 * @param {string} sha256
 * @returns {Promise<boolean>}
 */
export function checkSessionRecordBySHA256(sha256) {
   return new Promise(function (resolve, reject) {
      mysql().query(
         'SELECT id FROM sessions WHERE sha256 = ? LIMIT 1;',
         [sha256],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(Boolean(res.length));
         }
      );
   });
}

/**
 * Deletes session record by given `id`
 * @param {number} id
 * @returns {Promise<object>}
 */
export function deleteSessionById(id) {
   return new Promise(function (resolve, reject) {
      mysql().query(
         'DELETE FROM sessions WHERE id = ? LIMIT 1;',
         [id],
         (err, res) => {
            if (err) {
               return reject(err);
            }

            resolve(res);
         }
      );
   });
}
