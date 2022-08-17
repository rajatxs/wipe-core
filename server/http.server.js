import express from 'express';
import cors from 'cors';
import { PORT } from '../config/config.js';
import routes from '../routes/routes.js';
import logger from '../utils/logger.js';
import { send404Response, send500Response } from '../utils/http.js';

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

      // Handle 404
      app.use(function (req, res, next) {
         send404Response(res, "Resource not found");
      });

      // Handle 500
      app.use(function (error, req, res, next) {
         logger.error('http:error', error.message, error);
         send500Response(res, error.message || 'Something went wrong');
      });

      server = app.listen(PORT);

      server.on('listening', function() {
         logger.info('http:server', 'running on port', PORT);
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
