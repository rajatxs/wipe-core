import MySQL from 'mysql';
import {
   NODE_ENV,
   MYSQL_HOST,
   MYSQL_PORT,
   MYSQL_USER,
   MYSQL_PSWD,
   MYSQL_DB,
} from '../config/config.js';

/** @type {MySQL.Connection} */
var connection = null;

export function mysql() {
   if (!connection) {
      connect();
   }
   return connection;
}

export function connect() {
   /** @type {MySQL.ConnectionConfig} */
   const config = {
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PSWD,
      database: MYSQL_DB,
      multipleStatements: true,
   };

   // require ssl options for PlanetScale
   if (NODE_ENV === 'production') {
      config.ssl = {
         rejectUnauthorized: true,
      };
   }

   connection = MySQL.createConnection(config);
}

export function disconnect() {
   return new Promise((resolve, reject) => {
      if (!connection) {
         return resolve();
      }

      connection.end((err) => {
         if (err) {
            return reject(err);
         }

         connection = null;
         resolve();
      });
   });
}

/**
 * Executes `sql` query with given `values`
 * @param {string} sql - SQL Query
 * @param {any} [values] - Query values
 * @param {boolean} [toArray] - Keep result in array type
 */
export function executeQuery(sql, values = [], toArray = true) {
   return new Promise(function (resolve, reject) {
      mysql().query(sql, values, function (err, result) {
         if (err) {
            return reject(err);
         }

         if (Array.isArray(result) && !toArray) {
            resolve(result[0]);
         } else {
            resolve(result);
         }
      });
   });
}
