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
         rejectUnauthorized: true
      }
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
