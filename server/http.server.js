import express from 'express';
import cors from 'cors';
import { PORT } from '../config/config.js';
import routes from '../routes/routes.js';

/** @type {express.Application} */
var app;

/** @type {import('http').Server} */
var server;

export function startHttpServer() {
   return new Promise(function (resolve, reject) {
      if (app && server) {
         return resolve(server);
      }

      app = express();
      app.use(express.json());
      app.use(cors({
         origin: '*',
         allowedHeaders: ['X-Auth-Token', 'X-Tag'],
         methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
      }));
      app.use(routes);

      server = app.listen(PORT);

      server.on('listening', function() {
         console.log("SERVER RUNNING ON PORT", PORT);
         resolve(server);
      });
      server.on('error', function(err) {
         reject(err);
      });
   });
}

export function stopHttpServer() {
   return new Promise(function (resolve, reject) {
      if (!(app && server)) {
         return reject(new Error("server is not running"));
      }

      server.close(function(err) {
         if (err) {
            return reject(err);
         }

         app = undefined;
         server = undefined;
         resolve();
      });
   });
}
