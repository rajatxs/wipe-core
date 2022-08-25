import { mysql, disconnect } from '../utils/mysql.js';
import { readFile } from 'fs';
import path from 'path';
import logger from '../utils/logger.js';
import { format } from 'util';

/**
 * Reads and execute SQL Query from given `file`
 * @param {string} file
 * @returns {Promise<object>}
 */
function readAndExecuteQuery(file) {
   return new Promise(function (resolve, reject) {
      readFile(file, 'utf8', function (error, sql) {
         if (error) {
            logger.error('query', format("couldn't read %s", file));
            reject(error);
         } else {
            mysql().query(sql, function (queryError, result) {
               if (queryError) {
                  logger.error('query:sql', format("couldn't run %s", sql));
                  reject(queryError);
               }
               resolve(result);
            });
         }
      });
   });
}

(async function () {
   const files = process.argv.slice(2);
   for (let file of files) {
      const queryPath = path.join('sql', file + '.sql');
      await readAndExecuteQuery(queryPath);
   }
   disconnect();
})();
