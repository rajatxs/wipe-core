import path from 'path';
import { homedir } from 'os';
import { getTag } from '../utils/common.js';

// global vars
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || '8000';

// common vars
export const STORE_ROOT = process.env.WIPE_STORE_ROOT || path.join(homedir(), '.wipe');
export const TAG = process.env.WIPE_TAG || getTag();
export const WEBPUSH_SUBJECT = process.env.WIPE_WEBPUSH_SUBJECT;
export const AUTH_SECRET = process.env.WIPE_AUTH_SECRET;
export const SESSION_ROOT = path.join(STORE_ROOT, 'session_v3');

// SQLite config
export const SQLITE_DB_FILE = path.join(STORE_ROOT, 'store_v3.db');

// VAPID keys
export const VAPID_PUBLIC = process.env.WIPE_VAPID_PUBLIC;
export const VAPID_PRIVATE = process.env.WIPE_VAPID_PRIVATE;
