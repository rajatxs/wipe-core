# Wipe Core
Wipe allows you to track user's presence on WhatsApp.

## Requirements
You need to install few softwares including:
- [Node 12](https://nodejs.org)
- [MySQL 8](https://www.mysql.com)

## Install
You need to clone this repository and navigate into that directory
```sh
git clone https://github.com/rajatxs/wipe-core.git wipe
```
```sh
cd wipe
```

then install required dependencies using your favourite package manager
```sh
npm install
```
or
```sh
yarn install
```

add **.env** file with following variables
```markdown
# nodejs environment either "production" or "development"
NODE_ENV = "development"

# HTTP server port
PORT = "5050"

# use any secret to authenticate incoming API request
WIPE_AUTH_SECRET = "<your auth secret>"

# database configuration
WIPE_MYSQL_HOST = "<MySQL host>"
WIPE_MYSQL_PSWD = "<MySQL password>"
WIPE_MYSQL_PORT = "<MySQL port>"
WIPE_MYSQL_USER = "<MySQL user>"
WIPE_MYSQL_DB = "<MySQL database>"

# webpush subject either any URL or mailto:<your email>
WIPE_WEBPUSH_SUBJECT = "<your webpush subject>"
WIPE_VAPID_PUBLIC = "<your public VAPID key>"
WIPE_VAPID_PRIVATE = "<your private VAPID key>"
```

#### Pro Tip:
You can generate VAPID keys using
```sh
npx web-push generate-vapid-keys
```

finally you need to run SQL queries to setup tables in the database
> You can run those queries manually or using built in command

```sh
npm run query subs pres_hist push_subs sessions
```
or 
```sh
yarn query subs pres_hist push_subs sessions
```

add one subscription into database using
```sh
npm run subs:add <user name> <your target phone>
```
or
```sh
yarn subs:add <user name> <your target phone>
```

## Usage
Once you complete the setup you can run the following command to start HTTP and WA Socket service

If you did setup the environment globally then you can run 
```sh
npm start
```
or
```sh
yarn start
```

otherwise you can load .env file using 
```sh
npm run start:env
```
or
```sh
yarn start:env
```

> For the first time, you need to connect your WhatsApp by scanning a QR code from the terminal

If it will successfully be connected, the service will start tracking your target number and write history records in the database
