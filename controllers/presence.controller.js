import debug from 'debug';
import {
   send200Response,
   send400Response,
   send404Response,
   send500Response,
} from '../utils/http.js';
import {
   getPresenceHistoryBySubId,
   getPresenceHistoryById,
   deletePresenceHistoryRecordById,
   deletePresenceHistoryRecordBySubId,
} from '../services/presence.service.js';

/**
 * Sends presence history record by given id param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendPresenceHistoryRecordsById(req, res) {
   const id = Number(req.params.id);

   try {
      const record = await getPresenceHistoryById(id);

      if (record) {
         send200Response(res, 'Presence history record', record);
      } else {
         send404Response(res, 'Record not found');
      }
   } catch (error) {
      debug('wipe:controller:presence:error')(error);
      send500Response(res, "Couldn't get presence history record");
   }
}

/**
 * Sends presence history records by given `subid` query param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendPresenceHistoryRecordsBySubId(req, res) {
   const subId = Number(req.query.subid);
   const limit = Number(req.query.limit) || 100;

   if (!subId) {
      return send400Response(res, 'Require subid query param');
   }

   try {
      const records = await getPresenceHistoryBySubId(subId, limit);
      send200Response(res, 'Presence history', records);
   } catch (error) {
      debug('wipe:controller:presence:error')(error);
      send500Response(res, "Couldn't get presence history");
   }
}

/**
 * Delete presence history record by given id param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function deleteSinglePresenceHistoryRecordById(req, res) {
   const id = Number(req.params.id);

   try {
      const result = await deletePresenceHistoryRecordById(id);
      send200Response(res, 'Record deleted', result);
   } catch (error) {
      debug('wipe:controller:presence:error')(error);
      send500Response(res, "Couldn't delete record");
   }
}

/**
 * Delete all presence history records by given `subid` query param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function deleteAllPresenceHistoryRecordBySubId(req, res) {
   const subId = Number(req.query.subid);

   if (!subId) {
      return send400Response(res, 'Require subid query param');
   }

   try {
      const result = await deletePresenceHistoryRecordBySubId(subId);
      send200Response(res, 'Records deleted', result);
   } catch (error) {
      debug('wipe:controller:presence:error')(error);
      send500Response(res, "Couldn't delete presence history records");
   }
}
