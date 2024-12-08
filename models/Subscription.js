export class Subscription {
    /** @type {number} */
    id = NaN;

    /** @type {boolean} */
    enabled = true;

    /** @type {string} */
    alias = '';

    /** @type {string} */
    event = '';

    /** @type {boolean} */
    notify = true;

    /** @type {string} */
    phone = '';

    /** @type {string} */
    tag = '';

    /** @type {Date} */
    createdAt = new Date();

    /** @param {object} row */
    static fromRow(row) {
        const subs = new Subscription();

        subs.id = Number(row.id);
        subs.enabled = Boolean(row.enabled);
        subs.alias = String(row.alias);
        subs.event = String(row.event);
        subs.notify = Boolean(row.notify);
        subs.phone = String(row.phone);
        subs.tag = String(row.tag);
        subs.createdAt = new Date(row.created_at);
        return subs;
    }
}
