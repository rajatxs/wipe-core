import {
   send200Response,
   send201Response,
   send404Response,
} from '../utils/http.js';
import {
   getAllPushSubscriptions,
   getPushSubscriptionById,
   createPushSubscription,
   deletePushSubscription,
} from '../services/push-subs.service.js';

/**
 * Send all push subscription records
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendAllPushSubscriptions(req, res) {
   const limit = Number(req.query.limit) || 10;

   try {
      const records = await getAllPushSubscriptions(limit);
      send200Response(res, "All push subscriptions", records);
   } catch (error) {
      throw new Error("Couldn't get push subscriptions");
   }
}

/**
 * Send push subscription record by given id param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendPushSubscriptionById(req, res) {
   const id = Number(req.params.id);

   try {
      const record = await getPushSubscriptionById(id);

      if (record) {
         send200Response(res, 'Push subscription', record);
      } else {
         send404Response(res, 'Push subscription not found');
      }
   } catch (error) {
      throw new Error("Couldn't get push subscription");
   }
}

/**
 * Add new push subscription record
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function addNewPushSubscription(req, res) {
   /** @type {PushSubscriptionRecord} */
   const data = req.body;
   data.tag = req.locals.tag;

   try {
      const result = await createPushSubscription(data);
      send201Response(res, 'Push subscription added', result);
   } catch (error) {
      throw new Error("Couldn't add push subscription");
   }
}

/**
 * Deletes push subscription record by given id param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function deleteSinglePushSubscription(req, res) {
   const id = Number(req.params.id);

   try {
      const result = await deletePushSubscription(id);
      send200Response(res, 'Push subscription deleted', result);
   } catch (error) {
      throw new Error("Couldn't delete push subscription");
   }
}
