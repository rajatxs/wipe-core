import assert from 'assert';
import { randomBytes } from 'crypto';
import { openSQLiteDatabase, closeSQLiteDatabase } from '../utils/sqlite.js';
import {
    getSessionRecordById,
    getLatestSessionDetails,
    getLatestArchive,
    insertSessionRecord,
    checkSessionRecordById,
    checkSessionRecordBySHA256,
    deleteSessionById,
} from './session.js';
import { generateArchiveSHA256 } from '../utils/session.js';

let sessionId;
const archive = randomBytes(32),
    tag = 'TEST',
    sha256 = generateArchiveSHA256(archive);

describe('Session service', function () {
    this.beforeAll(function (done) {
        openSQLiteDatabase().finally(done);
    });

    this.afterAll(function (done) {
        closeSQLiteDatabase().finally(done);
    });

    it('should insert new session record', async function () {
        const id = await insertSessionRecord({
            sha256,
            archive,
            tag,
        });

        assert.ok(id > 0, 'incorrect id');
        sessionId = id;
    });

    it('should returns session record', async function () {
        const record = await getSessionRecordById(sessionId);

        assert.ok(record, 'session record not found');
        assert.equal(record.id, sessionId, 'incorrect sessionId');
        assert.equal(record.sha256, sha256, 'incorrect sha256');
        assert.equal(archive.compare(record.archive), 0, 'incorrect archive data');
        assert.equal(
            generateArchiveSHA256(record.archive),
            sha256,
            'incorrect archive sha256'
        );
        assert.equal(record.tag, tag, 'incorrect tag');
    });

    it('should check session record by id', async function () {
        const exists = await checkSessionRecordById(sessionId);
        assert.strictEqual(exists, true, 'should be true');
    });

    it('should check session record by sha256', async function () {
        const exists = await checkSessionRecordBySHA256(sha256);
        assert.strictEqual(exists, true, 'should be true');
    });

    it('should returns latest session record', async function () {
        const details = await getLatestSessionDetails();

        assert.ok(details, 'record not found');
        assert.equal(details.id, sessionId, 'incorrect sessionId');
        assert.equal(details.sha256, sha256, 'incorrect sha256');
        assert.equal(details.tag, tag, 'incorrect tag');
    });

    it('should returns latest archive', async function () {
        const result = await getLatestArchive();

        assert.ok(result, 'archive not found');
        assert.equal(archive.compare(result), 0, 'incorrect archive data');
        assert.equal(generateArchiveSHA256(result), sha256, 'incorrect archive sha256');
    });

    it('should delete session record by id', async function () {
        const changes = await deleteSessionById(sessionId);
        assert.equal(changes, 1, 'more rows are affected');

        const record = await getSessionRecordById(sessionId);
        assert.ok(!record, 'session record still exists');
    });
});
