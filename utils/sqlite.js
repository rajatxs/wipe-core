import sqlite3 from 'sqlite3';
import debug from 'debug';
import { SQLITE_DB_FILE } from '../config/config.js';

/** @type {sqlite3.Database} */
var instance;

/**
 * Reads single row from database collection
 * @param {string} query
 * @param {any[]} params
 */
export function getRow(query, params = []) {
    return new Promise(function (resolve, reject) {
        instance.get(query, params, function (err, row) {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

/**
 * Reads multiple rows from database collection
 * @param {string} query
 * @param {any[]} params
 */
export function getRows(query, params = []) {
    return new Promise(function (resolve, reject) {
        instance.all(query, params, function (error, rows) {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
}

/**
 * Insert single row into database collection
 * @param {string} query
 * @param {any[]} params
 * @returns {Promise<number>}
 */
export function insertRow(query, params = []) {
    return new Promise(function (resolve, reject) {
        const stmt = instance.prepare(query);

        stmt.run(params, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

/**
 * Update single row from database collection
 * @param {string} query
 * @param {any[]} params
 * @returns {Promise<number>}
 */
export function updateRow(query, params = []) {
    return new Promise(function (resolve, reject) {
        const stmt = instance.prepare(query);

        stmt.run(params, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(this.changes);
            }
        });
    });
}

/**
 * Delete single row from database collection
 * @param {string} query
 * @param {any[]} params
 * @returns {Promise<number>}
 */
export function deleteRow(query, params = []) {
    return new Promise(function (resolve, reject) {
        const stmt = instance.prepare(query);

        stmt.run(params, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(this.changes);
            }
        });
    });
}

/**
 * Executes given query statement
 * @param {string} query
 * @param {any[]} params
 * @returns {Promise<void>}
 */
export function runStatement(query, params = []) {
    return new Promise(function (resolve, reject) {
        const stmt = instance.prepare(query, function (prepareErr) {
            if (prepareErr) {
                return reject(prepareErr);
            }

            stmt.bind(...params);
            stmt.run(function (runErr) {
                if (runErr) {
                    return reject(runErr);
                }

                stmt.finalize(function (finalizeErr) {
                    if (finalizeErr) {
                        return reject(finalizeErr);
                    }

                    resolve();
                });
            });
        });
    });
}

async function prescript() {
    const queries = {
        CREATE_TABLE_SUBS: `
            CREATE TABLE IF NOT EXISTS \`subs\` (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                enabled BOOLEAN DEFAULT 1,
                alias VARCHAR(16),
                event VARCHAR(32) DEFAULT "presence.update",
                notify BOOLEAN DEFAULT 1,
                phone VARCHAR(15) NOT NULL,
                tag VARCHAR(8),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `,
        CREATE_TABLE_PRES_HIST: `
            CREATE TABLE IF NOT EXISTS \`pres_hist\` (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                status BOOLEAN NOT NULL,
                lastseen BIGINT,
                sub_id INTEGER REFERENCES subs(id),
                tag VARCHAR(8),
                ts DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `,
        CREATE_TABLE_PUSH_SUBS: `
            CREATE TABLE IF NOT EXISTS \`push_subs\` (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                enabled BOOLEAN DEFAULT 1,
                user_agent TEXT,
                payload JSON NOT NULL,
                tag VARCHAR(8),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `,
        CREATE_TABLE_SESSIONS: `
            CREATE TABLE IF NOT EXISTS \`sessions\` (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sha256 VARCHAR(64) NOT NULL,
                archive BLOB NOT NULL,
                tag VARCHAR(8),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `,
    };

    for (let queryName in queries) {
        const query = queries[queryName];

        instance.run(query, function (error) {
            if (error) {
                debug('wipe:sqlite:error')('failed to execute query %s', queryName);
            } else {
                debug('wipe:sqlite')('preset query executed %s', queryName);
            }
        });
    }
}

/**
 * Returns SQLite database instance
 * @returns {sqlite3.Database}
 */
export function sqlite() {
    return instance;
}

/**
 * Creates new SQLite database instance
 * @returns {Promise<void>}
 */
export function openSQLiteDatabase() {
    return new Promise(function (resolve, reject) {
        instance = new sqlite3.Database(SQLITE_DB_FILE, async function (error) {
            if (error) {
                debug('wipe:sqlite:error')(error.message);
                reject(error);
            } else {
                debug('wipe:sqlite')('database opened at %s', SQLITE_DB_FILE);

                try {
                    await prescript();
                } catch (error) {
                    return reject(error);
                }

                resolve();
            }
        });
    });
}

/**
 * Close active SQLite database connection
 * @returns {Promise<void>}
 */
export function closeSQLiteDatabase() {
    return new Promise(function (resolve, reject) {
        if (!instance) {
            return resolve();
        }

        instance.close(function (error) {
            if (error) {
                console.log('err code', error.stack);
                debug('wipe:sqlite:error')(error.message);
                reject(error);
            } else {
                instance = null;
                debug('wipe:sqlite')('database closed');
                resolve();
            }
        });
    });
}
