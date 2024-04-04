import multer from 'multer';
import fs from 'fs';
import debug from 'debug';
import { UPLOAD_ROOT } from '../config/config.js';

const dataStorage = multer.diskStorage({
    destination(req, file, cb) {
        const allowedFormats = [
            'application/octet-stream',
            'application/zip',
            'text/plain',
        ];

        if (!fs.existsSync(UPLOAD_ROOT)) {
            debug('wipe:multer:util')('uploads directory created at %s', UPLOAD_ROOT);
            fs.mkdirSync(UPLOAD_ROOT);
        }

        if (allowedFormats.includes(file.mimetype)) {
            cb(null, UPLOAD_ROOT);
        } else {
            cb(new Error('Invalid file format'), UPLOAD_ROOT);
        }
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});

export const upload = multer({
    storage: dataStorage,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
    },
});
