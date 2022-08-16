import {
   send200Response,
   send500Response,
   send404Response,
   send201Response,
} from '../utils/http.js';
import {
   getAllSubscriptions,
   getSubscriptionById,
   createSubscription,
   updateSubscription,
   deleteSubscription,
} from '../services/subs.service.js';

/**
 * Sends all subscription records
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendAllSubscriptions(req, res) {
   try {
      const subs = await getAllSubscriptions();
      send200Response(res, 'All subscriptions', subs);
   } catch (error) {
      send500Response(res, "Couldn't get subscriptions");
   }
}

/**
 * Sends subscription record by given id param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function sendSubscriptionById(req, res) {
   const id = Number(req.params.id);

   try {
      const record = await getSubscriptionById(id);

      if (record) {
         send200Response(res, 'Subscription record', record);
      } else {
         send404Response(res, 'Subscription not found');
      }
   } catch (error) {
      send500Response(res, "Couldn't get subscription");
   }
}

/**
 * Add new subscription record
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function addNewSubscription(req, res) {
   const data = req.body;

   try {
      const response = await createSubscription(data);
      send201Response(res, 'Subscription added', response);
   } catch (error) {
      send500Response(res, "Couldn't add new subscription");
   }
}

/**
 * Update subscription record by given id param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function updateSubscriptionById(req, res) {
   const id = Number(req.params.id);
   const data = req.body;

   try {
      const result = await updateSubscription(id, data);
      send200Response(res, 'Subscription updated', result);
   } catch (error) {
      send500Response(res, "Couldn't update subscription");
   }
}

/**
 * Deletes subscription record by given id param
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function deleteSubscriptionById(req, res) {
   const id = Number(req.params.id);

   try {
      const result = await deleteSubscription(id);
      send200Response(res, 'Subscription deleted', result);
   } catch (error) {
      send500Response(res, "Couldn't delete subscription");
   }
}
