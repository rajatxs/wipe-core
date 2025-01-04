import { TAG } from '../../config.js';

/**
 * Root middleware
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function rootMiddleware(req, res, next) {
    req.locals = {};
    req.locals.tag = req.header('X-Tag') || TAG;
    next(null);
}
