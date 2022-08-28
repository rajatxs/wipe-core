import assert from 'assert';
import { disconnect } from '../utils/mysql.js';
import {
   getPushSubscriptionById,
   createPushSubscription,
   updatePushSubscription,
   deletePushSubscription,
} from './push-subs.service.js';
import { generatePushPayloadSHA256 } from '../utils/common.js';

/** @type {number} */
var pushSubId;

const tag = 'TEST',
   payload = '{}',
   user_agent = 'Mozilla/5.0',
   sha256 = generatePushPayloadSHA256(payload);

describe('Push subscription service', function () {
   this.afterAll(function (done) {
      disconnect().then(done).catch(done);
   });

   it('should insert new push subscription record', async function () {
      const res = await createPushSubscription({
         user_agent,
         payload,
         tag,
      });

      assert.ok(res.insertId > 0, 'incorrect insertId');
      assert.equal(res.affectedRows, 1, 'more rows are affected');
      pushSubId = res.insertId;
   });

   it('should returns push subscription record', async function () {
      const record = await getPushSubscriptionById(pushSubId);

      assert.ok(record, 'push subscription not found');
      assert.equal(record.id, pushSubId, 'incorrect pushSubId');
      assert.equal(record.enabled, 1, 'should be enabled by default');
      assert.equal(record.user_agent, user_agent, 'incorrect user_agent');
      assert.equal(record.rejection_count, 0, 'rejection count should be zero');
      assert.equal(record.payload, payload, 'incorrect payload');
      assert.equal(record.sha256, sha256, 'incorrect sha256');
      assert.equal(record.tag, tag, 'incorrect tag');
      assert.ok(record.created_at, 'invalid created_at');
   });

   it('should update push subscription record', async function () {
      const res = await updatePushSubscription(pushSubId, {
         enabled: 0,
      });
      assert.equal(res.affectedRows, 1, 'more rows are affected');

      const record = await getPushSubscriptionById(pushSubId);
      assert.equal(record.id, pushSubId, 'pushSubId has been changed');
      assert.equal(record.enabled, 0, 'incorrect enabled value');
      assert.equal(record.payload, payload, 'payload has been changed');
      assert.equal(record.sha256, sha256, 'sha256 has been changed');
      assert.equal(
         record.rejection_count,
         0,
         'rejection count has been changed'
      );
      assert.equal(
         record.user_agent,
         user_agent,
         'user_agent has been changed'
      );
      assert.equal(record.tag, tag, 'tag has been changed');
   });

   it('should delete push subscription record', async function () {
      const res = await deletePushSubscription(pushSubId);
      assert.equal(res.affectedRows, 1, 'more rows are affected');

      const record = await getPushSubscriptionById(pushSubId);
      assert.ok(!record, 'push subscription record still exists');
   });
});
