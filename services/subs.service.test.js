import assert from 'assert';
import { disconnect } from '../utils/mysql.js';
import {
   getSubscriptionById,
   createSubscription,
   updateSubscription,
   deleteSubscription,
} from './subs.service.js';

const tag = "TEST";

let subId,
   alias = 'Test',
   phone = '101010101010';

/** @type {SubscriptionEvent} */
let event = 'presence.update';

/** @type {SubscriptionEvent[]} */
const events = ['presence.update'];

describe('Subscription service', function () {
   this.afterAll(function (done) {
      disconnect().then(done).catch(done);
   });

   it('should insert new subscription record', async function () {
      const res = await createSubscription({
         alias,
         event,
         phone,
         tag,
      });

      assert.ok(res.insertId > 0, 'incorrect insertId');
      assert.equal(res.affectedRows, 1, 'more rows are affected');
      subId = res.insertId;
   });

   it('should returns subscription record', async function () {
      const subs = await getSubscriptionById(subId);

      assert.ok(subs, 'subscription not found');
      assert.equal(subs.id, subId, 'incorrect subId');
      assert.equal(typeof subs.enabled, 'number', 'invalid type of enabled');
      assert.equal(typeof subs.alias, 'string', 'invalid type of alias');
      assert.equal(subs.tag, tag, "incorrect tag");
      assert.ok(events.includes(subs.event), 'incorrect event');
      assert.equal(typeof subs.notify, 'number', 'invalid notify');
      assert.equal(subs.phone.length, 12, 'incorrect phone');
   });

   it('should update subscription record', async function () {
      alias = 'New alias';
      const res = await updateSubscription(subId, { alias });
      assert.equal(res.affectedRows, 1, 'more rows are affected');

      const subs = await getSubscriptionById(subId);
      assert.equal(subs.id, subId, 'subId is affected');
      assert.equal(subs.alias, alias, 'alias not updated');
   });

   it('should delete subscription record', async function () {
      const res = await deleteSubscription(subId);
      assert.equal(res.affectedRows, 1, 'more rows are affected');

      const subs = await getSubscriptionById(subId);
      assert.ok(!subs, 'subscription record still exists');
   });
});
