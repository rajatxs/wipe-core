# Wipe Core

Wipe enables you to monitor users presence on WhatsApp.

## Requirements

To utilize Wipe, ensure the following software applications are installed:

- [Node 12](https://nodejs.org)

## Install

Clone this repository and navigate to the corresponding directory:

```shell
git clone https://github.com/rajatxs/wipe-core.git wipe
```

```shell
cd wipe
```

Then, install the required dependencies using your preferred package manager:

```shell
npm install
```

or

```shell
yarn install
```

Additionally, create a `.env` file with the following variables:

```shell
# enable debug logs
DEBUG = "wipe,wipe:*"

# nodejs environment either "production" or "development"
NODE_ENV = "development"

# HTTP server port
PORT = "5050"

# use any secret to authenticate incoming API request
WIPE_AUTH_SECRET = "<your auth secret>"

## Usage

Once the setup is completed, you can initiate the HTTP and WhatsApp Socket service using the following command:

If you have configured the environment globally, you can execute:

```shell
npm start
```
or
```shell
yarn start
```

Alternatively, you can load the `.env` file using:

```shell
npm run start:env
```

or

```shell
yarn start:env
```

> For the initial setup, you need to connect your WhatsApp by scanning a QR code from the terminal.

After completing the setup process, the service will begin listening for the events to which you have subscribed.

For more information or inquiries, please contact the project owner: Rajat (rajatxt@proton.me)
