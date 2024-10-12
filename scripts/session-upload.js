import { uploadSession } from '../services/session.js';
import { openSQLiteDatabase, closeSQLiteDatabase } from '../utils/sqlite.js';

(async function () {
    try {
        await openSQLiteDatabase();
        await uploadSession();
    } catch (error) {
        console.error(error.message);
    }

    await closeSQLiteDatabase();
})();
