declare interface AppRequestLocals {
   tag?: string;
}

declare namespace Express {
   interface Request {
      locals: AppRequestLocals
   }
}

declare type SubscriptionEvent = 'presence.update';

declare interface Subscription {
   id?: number;
   enabled?: number;
   alias?: string;
   event: SubscriptionEvent;
   notify?: number;
   phone: string;
   tag?: string;
   created_at?: string;
}

declare interface PresenceHistory {
   id?: number;
   status: number;
   ts?: string;
   lastseen?: number;
   tag?: string;
   sub_id: number;
}

declare interface PushSubscriptionRecord {
   id?: number;
   enabled?: number;
   user_agent?: string;
   payload: string;
   tag?: string;
   created_at?: string;
}

declare interface SessionRecord {
   id?: number;
   sha256: string;
   archive: Buffer;
   tag?: string;
   created_at?: Date;
}

declare type SessionDetail = Omit<SessionRecord, 'archive'>;

type PresenceNotificationPayload = [
   /** Payload type */
   number, 

   /** Subscription alias */
   string, 

   /** Presence status */
   boolean, 

   /** Timestamp */
   number
];

type ServiceStatusUpdateNotificationPayload = [
   /** Payload type */
   number,

   /** Service type */
   number,

   /** Service status */
   boolean,

   /** Timestamp */
   number,
];
