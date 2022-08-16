import assert from 'assert';
import { randomBytes } from 'crypto';
import { disconnect } from '../utils/mysql.js';
import {
   getSessionRecordById,
   getLatestSessionDetails,
   getLatestArchive,
   insertSessionRecord,
   checkSessionRecordById,
   checkSessionRecordBySHA256,
} from './session.service.js';
import { generateArchiveSHA256 } from '../utils/session.js';

let sessionId, createdAt;
const archive = randomBytes(8),
   tag = 'TEST',
   sha256 = generateArchiveSHA256(archive);

describe('Session service', function () {
   this.afterAll(function (done) {
      disconnect().then(done).catch(done);
   });

   it('should insert new session record', async function () {
      const res = await insertSessionRecord({
         sha256,
         archive,
         tag,
      });

      assert.ok(res.insertId > 0, 'incorrect insertId');
      assert.equal(res.affectedRows, 1, 'more rows are affected');
      sessionId = res.insertId;
   });

   it('should returns session record', async function () {
      const record = await getSessionRecordById(sessionId);

      assert.ok(record, 'session record not found');
      assert.equal(record.id, sessionId, 'incorrect sessionId');
      assert.equal(record.sha256, sha256, 'incorrect sha256');
      assert.equal(
         archive.compare(record.archive),
         0,
         'incorrect archive data'
      );
      assert.equal(
         generateArchiveSHA256(record.archive),
         sha256,
         'incorrect archive sha256'
      );
      assert.equal(record.tag, tag, 'incorrect tag');
      assert.ok(
         record.created_at instanceof Date,
         'incorrect type of created_at'
      );
      createdAt = record.created_at;
   });

   it('should check session record by id', async function () {
      const exists = await checkSessionRecordById(sessionId);

      assert.equal(typeof exists, 'boolean', 'result should be boolean type');
      assert.equal(exists, true, 'should be true');
   });

   it('should check session record by sha256', async function () {
      const exists = await checkSessionRecordBySHA256(sha256);

      assert.equal(typeof exists, 'boolean', 'result should be boolean type');
      assert.equal(exists, true, 'should be true');
   });

   it('should returns latest session record', async function () {
      const details = await getLatestSessionDetails();

      assert.ok(details, 'record not found');
      assert.equal(details.id, sessionId, 'incorrect sessionId');
      assert.equal(details.sha256, sha256, 'incorrect sha256');
      assert.equal(details.tag, tag, 'incorrect tag');
      assert.equal(
         details.created_at.getTime(),
         createdAt.getTime(),
         'incorrect created_at'
      );
   });

   it('should returns latest archive', async function () {
      const result = await getLatestArchive();

      assert.ok(result, 'archive not found');
      assert.equal(archive.compare(result), 0, 'incorrect archive data');
      assert.equal(
         generateArchiveSHA256(result),
         sha256,
         'incorrect archive sha256'
      );
   });
});
