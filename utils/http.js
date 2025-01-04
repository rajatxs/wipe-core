/**
 * Sends `msg` as response with specified status code
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {object} result
 */
export function sendResponse(res, statusCode, message, result = {}) {
    res.status(statusCode).json({
        statusCode,
        message,
        result,
    });
}

/**
 * Sends `msg` as response with 200 status code
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object} result
 */
export function send200Response(res, message = 'Ok', result = {}) {
    sendResponse(res, 200, message, result);
}

/**
 * Sends `msg` as response with 201 status code
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object} result
 */
export function send201Response(res, message = 'Created', result = {}) {
    sendResponse(res, 201, message, result);
}

/**
 * Sends `msg` as response with 400 status code
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object} result
 */
export function send400Response(res, message = 'Invalid', result = {}) {
    sendResponse(res, 400, message, result);
}

/**
 * Sends `msg` as response with 401 status code
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object} result
 */
export function send401Response(res, message = 'Unauthorized', result = {}) {
    sendResponse(res, 401, message, result);
}

/**
 * Sends `msg` as response with 404 status code
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object} result
 */
export function send404Response(res, message = 'Not found', result = {}) {
    sendResponse(res, 404, message, result);
}

/**
 * Sends `msg` as response with 500 status code
 * @param {import('express').Response} res
 * @param {string} message
 * @param {object} result
 */
export function send500Response(res, message = 'Something went wrong', result = {}) {
    sendResponse(res, 500, message, result);
}
