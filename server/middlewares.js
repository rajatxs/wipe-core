import { TAG, AUTH_SECRET } from '../config.js';
import { verifyToken } from '../services/auth.js';
import { send400Response, send401Response, send500Response } from '../utils/http.js';

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

/**
 * Authentication middleware
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function authMiddleware(req, res, next) {
    const token = req.header('X-Auth-Token');
    let verified = false;

    if (!token) {
        return send400Response(res, 'Missing X-Auth-Token in headers');
    }

    try {
        verified = await verifyToken(AUTH_SECRET, token);
    } catch (error) {
        return send500Response(res, "Couldn't verify token");
    }

    return verified ? next(null) : send401Response(res, 'Invalid token');
}
