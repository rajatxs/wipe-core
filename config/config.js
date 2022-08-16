import path from 'path';
import { homedir } from 'os';
import { getTag } from '../utils/common.js';

// global vars
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;

// common vars
export const TAG = process.env.WIPE_TAG || getTag();
export const WEBPUSH_SUBJECT = process.env.WIPE_WEBPUSH_SUBJECT;
export const AUTH_SECRET = process.env.WIPE_AUTH_SECRET;
export const SESSION_ROOT = process.env.WIPE_SESSION_ROOT || path.join(homedir(), '.wipe');

// MySQL config
export const MYSQL_HOST = process.env.WIPE_MYSQL_HOST;
export const MYSQL_PSWD = process.env.WIPE_MYSQL_PSWD;
export const MYSQL_PORT = Number(process.env.WIPE_MYSQL_PORT);
export const MYSQL_USER = process.env.WIPE_MYSQL_USER;
export const MYSQL_DB = process.env.WIPE_MYSQL_DB;

// VAPID keys
export const VAPID_PUBLIC = process.env.WIPE_VAPID_PUBLIC;
export const VAPID_PRIVATE = process.env.WIPE_VAPID_PRIVATE;
