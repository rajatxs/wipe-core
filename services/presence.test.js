import assert from 'assert';
import { openSQLiteDatabase, closeSQLiteDatabase } from '../utils/sqlite.js';
import {
    getPresenceHistoryById,
    insertPresenceHistoryRecord,
    deletePresenceHistoryRecordById,
} from './presence.js';

const sub_id = 1;
const tag = 'TEST';

/** @type {number} */
let presRecordId;

describe('Presence service', function () {
    this.beforeAll(function (done) {
        openSQLiteDatabase().finally(done);
    });

    this.afterAll(function (done) {
        closeSQLiteDatabase().finally(done);
    });

    it('should insert presence history record', async function () {
        const insertId = await insertPresenceHistoryRecord({
            status: 1,
            sub_id,
            tag,
        });

        assert.ok(insertId > 0, 'incorrect insertId');
        presRecordId = insertId;
    });

    it('should return presence history record', async function () {
        const record = await getPresenceHistoryById(presRecordId);
        console.log("record", record)

        assert.equal(record.id, presRecordId, 'incorrect id');
        assert.equal(record.status, 1, 'incorrect status');

        if (record.lastseen) {
            assert.equal(typeof record.lastseen, 'number', 'incorrect typeof lastseen');
        }

        assert.equal(record.sub_id, sub_id, 'incorrect sub_id');
        assert.equal(record.tag, tag, 'incorrect tag');
        assert.ok(record.ts, 'invalid timestamp');
    });

    it('should delete presence history record', async function () {
        const changes = await deletePresenceHistoryRecordById(presRecordId);
        assert.equal(changes, 1, 'more rows are affected');

        const record = await getPresenceHistoryById(presRecordId);
        assert.ok(!record, 'presence history record still exists');
    });
});
