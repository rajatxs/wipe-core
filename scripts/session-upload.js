import { uploadSession } from '../services/session.service.js';
import { openSQLiteDatabase, closeSQLiteDatabase } from '../utils/sqlite.js';

// TODO: Test session upload functionality
(async function () {
    try {
        await openSQLiteDatabase();
        await uploadSession();
    } catch (error) {
        console.error(error.message);
    }

    await closeSQLiteDatabase();
})();
