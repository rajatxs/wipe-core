import {
   send200Response,
   send201Response,
   send404Response,
} from '../utils/http.js';
import {
   getAllPushSubscriptions,
   checkPushSubscriptionBySha256,
   getPushSubscriptionById,
   createPushSubscription,
   deletePushSubscription,
} from '../services/push-subs.service.js';

/**
 * Send all push subscription records
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function sendAllPushSubscriptions(req, res, next) {
   const limit = Number(req.query.limit) || 10;

   try {
      const records = await getAllPushSubscriptions(limit);
      send200Response(res, "All push subscriptions", records);
   } catch (error) {
      next(["Couldn't get push subscriptions", error]);
   }
}

/**
 * Send push subscription record by given id param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function sendPushSubscriptionById(req, res, next) {
   const id = Number(req.params.id);

   try {
      const record = await getPushSubscriptionById(id);

      if (record) {
         send200Response(res, 'Push subscription', record);
      } else {
         send404Response(res, 'Push subscription not found');
      }
   } catch (error) {
      next(["Couldn't get push subscription", error]);
   }
}

/**
 * Send push subscription record check result by given `sha256` param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function sendPushSubscriptionCheck(req, res, next) {
   const sha256 = req.params.sha256;

   try {
      const exists = await checkPushSubscriptionBySha256(sha256);
      send200Response(res, "Push subscription check", { exists });
   } catch (error) {
      next(["Couldn't check push subscription", error]);
   }
}


/**
 * Add new push subscription record
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function addNewPushSubscription(req, res, next) {
   /** @type {PushSubscriptionRecord} */
   const data = req.body;
   data.tag = req.locals.tag;

   try {
      const result = await createPushSubscription(data);
      send201Response(res, 'Push subscription added', result);
   } catch (error) {
      next(["Couldn't add push subscription", error]);
   }
}

/**
 * Deletes push subscription record by given id param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function deleteSinglePushSubscription(req, res, next) {
   const id = Number(req.params.id);

   try {
      const result = await deletePushSubscription(id);
      send200Response(res, 'Push subscription deleted', result);
   } catch (error) {
      next(["Couldn't delete push subscription", error]);
   }
}
