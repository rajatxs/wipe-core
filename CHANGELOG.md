# Changelog

All notable changes to this project will be documented in this file.

## v3.3.3

### Added
- Send an alert notification on the contact update event.

## v3.3.2

### Dependency changes
- Replace `@whiskeysockets/baileys` with `baileys`

## v3.3.1

### Added
- Sending presence alerts in the form of WA notification.
- Disable presence alerts by default.

## v3.3.0

### Dependency changes
- Upgraded `@whiskeysockets/baileys 6.7.8` package to version "6.7.9"
- Upgraded `debug 4.3.0` package to version "4.4.0"
- Upgraded `express 4.19.2` package to version "4.21.2"
- Upgraded `mocha 10.4.0` package to version "10.8.2"
- Upgraded `nodemon 3.1.0` package to version "3.1.9"
- Upgraded `@flydotio/dockerfile 0.5.0` package to version "0.5.9"
- Upgraded `@types/mocha 10.0.6` package to version "10.0.10"

## v3.2.0

### Dependency changes
- Removed `web-push` package
- Removed `msgpackr` package
- Removed `adm-zip` package

### Removed
- Push service

## v3.0.0

### Added
- Store APIs
- Socket uptime

### Changed
- Uses SQLite 3

### Dependency changes
- Added `sqlite3 5.1.7` package
- Added `debug 4.3.4` package
- Added `@types/mocha 10.0.6` package
- Upgraded `adm-zip 0.5.9` package to version "0.5.12"
- Upgraded `express 4.18.1` package to version "4.19.2"
- Upgraded `mocha 10.0.0` package to version "10.4.0"
- Upgraded `nodemon 3.0.2` package to version "3.1.0"
- Removed `@rxpm/logger 1.0.0` package
- Removed `mysql 2.18.1` package
- Upgraded `@whiskeysockets/baileys 6.5.0` package to version "6.6.0"
- Upgraded `web-push 3.5.0` package to version "3.6.7"
- Upgraded `msgpackr 1.6.2` package to version "1.10.1"
- Added `multer 1.4.5` package

### Deprecated
- Deprecated MySQL in favor of SQLite

### Removed
- Logger utility
- MySQL utility
- SQL scripts
