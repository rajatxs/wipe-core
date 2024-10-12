import assert from 'assert';
import { openSQLiteDatabase, closeSQLiteDatabase } from '../utils/sqlite.js';
import {
    getPushSubscriptionById,
    createPushSubscription,
    deletePushSubscription,
} from './push-subs.js';

var pushSubId = 1,
    payload = '{}';
const tag = 'TEST',
    user_agent = 'Mozilla/5.0';

describe('Push subscription service', function () {
    this.beforeAll(function (done) {
        openSQLiteDatabase().finally(done);
    });

    this.afterAll(function (done) {
        closeSQLiteDatabase().finally(done);
    });

    it('should insert new push subscription record', async function () {
        const id = await createPushSubscription({
            user_agent,
            payload,
            tag,
        });

        assert.ok(id > 0, 'incorrect id');
        pushSubId = id;
    });

    it('should returns push subscription record', async function () {
        const record = await getPushSubscriptionById(pushSubId);

        assert.ok(record, 'push subscription not found');
        assert.equal(record.id, pushSubId, 'incorrect pushSubId');
        assert.equal(record.enabled, 1, 'need to enable by default');
        assert.equal(record.user_agent, user_agent, 'incorrect user_agent');
        assert.equal(record.payload, payload, 'incorrect payloat');
        assert.equal(record.tag, tag, 'incorrect tag');
        assert.ok(record.created_at, 'invalid created_at');
    });

    it('should delete push subscription record', async function () {
        const changes = await deletePushSubscription(pushSubId);
        assert.equal(changes, 1, 'more rows are affected');

        const record = await getPushSubscriptionById(pushSubId);
        assert.ok(!record, 'push subscription record still exists');
    });
});
