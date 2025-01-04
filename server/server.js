import express from 'express';
import cors from 'cors';
import debug from 'debug';
import { PORT } from '../config.js';
import { rootMiddleware } from './middlewares/root.js';
import routes from './routes/routes.js';
import { send404Response, send500Response } from '../utils/http.js';

/** @type {express.Application} */
var app;

/** @type {import('http').Server} */
var server;

/**
 * Starts new http server instance
 * @returns {Promise<void>}
 */
export function startHttpServer() {
    return new Promise(function (resolve, reject) {
        if (app && server) {
            return resolve();
        }

        app = express();
        app.use(express.json());
        app.use(
            cors({
                origin: '*',
                allowedHeaders: ['Content-Type', 'X-Auth-Token', 'X-Tag'],
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
            })
        );
        app.use(rootMiddleware);
        app.use(routes);

        // Handle 404
        app.use(function (req, res, next) {
            send404Response(res, 'Resource not found');
        });

        // Handle 500
        app.use(function (error, req, res, next) {
            debug('wipe:server:error')(error.message);
            send500Response(res, error.message || 'Something went wrong');
        });

        server = app.listen(PORT);

        server.on('listening', function () {
            debug('wipe:server')('running on port %d', PORT);
            resolve();
        });
        server.on('error', function (err) {
            reject(err);
        });
    });
}

/**
 * Stops active server instance
 * @returns {Promise<void>}
 */
export function stopHttpServer() {
    return new Promise(function (resolve, reject) {
        if (!server) {
            return resolve();
        }

        server.close(function (err) {
            if (err) {
                debug('wipe:server')(err.message);
                return reject(err);
            }

            app = undefined;
            server = undefined;
            debug('wipe:server')('server stopped');
            resolve();
        });
    });
}
