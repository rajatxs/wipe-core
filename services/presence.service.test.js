import assert from 'assert';
import { disconnect } from '../utils/mysql.js';
import {
   getPresenceHistoryById,
   insertPresenceHistoryRecord,
   deletePresenceHistoryRecordById,
} from './presence.service.js';

const sub_id = 1;
const tag = 'TEST';
let presRecordId;

describe('Presence service', function () {
   this.afterAll(function (done) {
      disconnect().then(done).catch(done);
   });

   it('should insert presence history record', async function () {
      const record = await insertPresenceHistoryRecord({
         status: 1,
         sub_id,
         tag,
      });

      assert.notEqual(record.affectedRows < 1, 'no rows are affected');
      assert.notEqual(record.affectedRows > 1, 'more rows are affected');
      assert.ok(record.insertId >= 1, 'found invalid insertId');
      presRecordId = record.insertId;
   });

   it('should return presence history record', async function () {
      const record = await getPresenceHistoryById(presRecordId);

      assert.equal(record.id, presRecordId, 'incorrect presRecordId');
      assert.equal(record.status, 1, 'incorrect status');

      if (record.lastseen) {
         assert.equal(
            typeof record.lastseen,
            'number',
            'incorrect typeof lastseen'
         );
      }

      assert.equal(record.sub_id, sub_id, 'incorrect sub_id');
      assert.equal(record.tag, tag, 'incorrect tag');
      assert.ok(record.ts, 'invalid timestamp');
   });

   it('should delete presence history record', async function () {
      const res = await deletePresenceHistoryRecordById(presRecordId);
      assert.equal(res.affectedRows, 1, 'more rows are affected');

      const record = await getPresenceHistoryById(presRecordId);
      assert.ok(!record, 'presence history record still exists');
   });
});
