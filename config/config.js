import path from 'path';
import { homedir } from 'os';
import { getTag } from '../utils/common.js';

// global vars
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || '8000';

// common vars
export const STORE_ROOT = process.env.WIPE_STORE_ROOT || path.join(homedir(), '.wipe');
export const UPLOAD_ROOT = path.join(STORE_ROOT, 'uploads');
export const TAG = process.env.WIPE_TAG || getTag();
export const AUTH_SECRET = process.env.WIPE_AUTH_SECRET;
export const SESSION_ROOT = path.join(STORE_ROOT, 'session_v3');
export const SUBSCRIBER_PHONE = process.env.WIPE_SUBSCRIBER_PHONE;

// SQLite config
export const SQLITE_DB_FILE = path.join(STORE_ROOT, 'store_v3.db');
