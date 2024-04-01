import assert from 'assert';
import { openSQLiteDatabase, closeSQLiteDatabase } from '../utils/sqlite.js';
import {
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
} from './subs.js';

const tag = 'TEST';

let subId,
    alias = 'Test',
    phone = '101010101010';

/** @type {SubscriptionEvent} */
let event = 'presence.update';

/** @type {SubscriptionEvent[]} */
const events = ['presence.update'];

describe('Subscription service', function () {
    this.beforeAll(function (done) {
        openSQLiteDatabase().finally(done);
    });

    this.afterAll(function (done) {
        closeSQLiteDatabase().finally(done);
    });

    it('should insert new subscription record', async function () {
        const insertId = await createSubscription({
            alias,
            event,
            phone,
            tag,
        });

        assert.ok(insertId > 0, 'incorrect insertId');
        subId = insertId;
    });

    it('should returns subscription record', async function () {
        const subs = await getSubscriptionById(subId);

        assert.ok(subs, 'subscription not found');
        assert.equal(subs.id, subId, 'incorrect id');
        assert.equal(typeof subs.enabled, 'number', 'invalid type of enabled');
        assert.equal(typeof subs.alias, 'string', 'invalid type of alias');
        assert.equal(subs.tag, tag, 'incorrect tag');
        assert.ok(events.includes(subs.event), 'incorrect event');
        assert.equal(typeof subs.notify, 'number', 'invalid notify');
        assert.strictEqual(subs.phone, phone, 'incorrect phone');
    });

    it('should update subscription record', async function () {
        alias = 'New alias';
        const changes = await updateSubscription(subId, { alias, enabled: 0, notify: 0 });
        assert.equal(changes, 1, 'more rows are affected');

        // Get updated subscription record
        const subs = await getSubscriptionById(subId);

        assert.equal(subs.id, subId, 'id value has affected');
        assert.equal(subs.tag, tag, 'tag value has tag');
        assert.strictEqual(subs.phone, phone, 'phone value has affected');

        assert.equal(subs.alias, alias, 'alias propety has not updated');
        assert.equal(subs.enabled, 0, 'enabled property has not updated');
        assert.equal(subs.notify, 0, 'notify property has not updated');
    });

    it('should delete subscription record', async function () {
        const changes = await deleteSubscription(subId);
        assert.equal(changes, 1, 'more rows are affected');

        const subs = await getSubscriptionById(subId);
        assert.ok(!subs, 'subscription record still exists');
    });
});
