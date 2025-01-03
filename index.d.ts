declare interface AppRequestLocals {
    tag?: string;
}

declare namespace Express {
    interface Request {
        locals: AppRequestLocals;
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
