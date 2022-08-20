import { send200Response, send404Response } from '../utils/http.js';
import {
   getLatestSessionDetails,
   getSessionDetailsById,
   getAllSessionDetails,
   uploadSession,
   restoreLatestSession,
   deleteSessionById,
} from '../services/session.service.js';

/**
 * Sends details of latest session
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function sendLatestSessionDetails(req, res, next) {
   try {
      const session = await getLatestSessionDetails();
      send200Response(res, 'Latest session', session);
   } catch (error) {
      next(new Error("Couldn't get latest session details"));
   }
}

/**
 * Sends details of all sessions
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function sendAllSessionDetails(req, res, next) {
   const limit = Number(req.query.limit) || 50;

   try {
      const sessions = await getAllSessionDetails(limit);
      send200Response(res, "All sessions", sessions);
   } catch (error) {
      next(new Error("Couldn't get sessions"));
   }
}

/**
 * Sends details of session by given `id`
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function sendSessionDetailsByGivenId(req, res, next) {
   const id = Number(req.params.id);

   try {
      const session = await getSessionDetailsById(id);

      if (session) {
         send200Response(res, "Session record", session);
      } else {
         send404Response(res, "Session not found");
      }
   } catch (error) {
      next(new Error("Couldn't get session"));
   }
}

/**
 * Handles request to upload current session
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function requestToUploadSession(req, res, next) {
   try {
      await uploadSession();
      send200Response(res, 'Session uploaded');
   } catch (error) {
      next(new Error("Couldn't upload session"));
   }
}

/**
 * Handles request to restore session
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function requestToRestoreSession(req, res, next) {
   try {
      await restoreLatestSession();
      send200Response(res, 'Session restored');
   } catch (error) {
      next(new Error("Couldn't restore session"));
   }
}

/**
 * Deletes single session record by given id
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function deleteSingleSessionRecordById(req, res, next) {
   const id = Number(req.params.id);

   try {
      const result = await deleteSessionById(id);
      send200Response(res, "Session deleted", result);
   } catch (error) {
      next(new Error("Couldn't delete session"));
   }
}
