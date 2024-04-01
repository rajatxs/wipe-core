import { restoreLatestSession } from '../services/session.service.js';
import { openSQLiteDatabase, closeSQLiteDatabase } from '../utils/sqlite.js';

// TODO: Test session restore functionality
(async function () {
    try {
        await openSQLiteDatabase();
        await restoreLatestSession();
    } catch (error) {
        console.error(error.message);
    }

    await closeSQLiteDatabase();
})();
