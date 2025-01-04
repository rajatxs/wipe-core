import debug from 'debug';
import { waSocket, registerWAEventBySubscription } from '../../services/wa.js';
import {
    getAllSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
} from '../../services/subs.js';
import {
    send200Response,
    send404Response,
    send201Response,
    send500Response,
} from '../../utils/http.js';

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
        debug('wipe:controller:subs:error')(error);
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
        debug('wipe:controller:subs:error')(error);
        send500Response(res, "Couldn't get subscription");
    }
}

/**
 * Add new subscription record
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function addNewSubscription(req, res) {
    /** @type {Subscription} */
    const data = req.body;
    data.tag = req.locals.tag;

    try {
        const subId = await createSubscription(data);
        const subs = await getSubscriptionById(subId);

        if (waSocket()) {
            await registerWAEventBySubscription(subs);
            debug('wipe:controller:subs')(
                'subscribe event=%s id=%d',
                subs.event,
                subs.id
            );
        }

        send201Response(res, 'Subscription added', { id: subId });
    } catch (error) {
        debug('wipe:controller:subs:error')(error);
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
        const changes = await updateSubscription(id, data);
        send200Response(res, 'Subscription updated', { changes });
    } catch (error) {
        debug('wipe:controller:subs:error')(error);
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
        const changes = await deleteSubscription(id);
        send200Response(res, 'Subscription deleted', { changes });
    } catch (error) {
        debug('wipe:controller:subs:error')(error);
        send500Response(res, "Couldn't delete subscription");
    }
}
