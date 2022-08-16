import WebPush from 'web-push';
import { WEBPUSH_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE } from '../config/config.js';

export function webpush() {
   return WebPush;
}

export function configureWebPush() {
   WebPush.setVapidDetails(WEBPUSH_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}
