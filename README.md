# Wipe Core

Wipe allows you to monitor user presence on WhatsApp.

## Requirements

Before you begin, ensure that the following software is installed on your system:

- [Node 12](https://nodejs.org)

## Install

Clone this repository and navigate to the appropriate directory:

```shell
git clone https://github.com/rajatxs/wipe-core.git wipe
```

```shell
cd wipe
```

Next, install the required dependencies using your preferred package manager:

```shell
npm install
```

Additionally, create a `.env` file containing the following variables:

```shell
# enable debug logs
DEBUG = "wipe,wipe:*"

# nodejs environment either "production" or "development"
NODE_ENV = "development"

# HTTP server port
PORT = "5050"

# use any secret to authenticate incoming API request
WIPE_AUTH_SECRET = "<your auth secret>"

# WhatsApp phone number to receive updates
WIPE_SUBSCRIBER_PHONE = "<phone number>"
```

## Usage

After completing the setup, you can start the HTTP and WhatsApp Socket services using the following command:

```shell
npm run dev
```

> For the initial setup, connect your WhatsApp by scanning the QR code displayed in the terminal.

Once the setup process is complete, the service will start listening for the events you have subscribed to.

For more information or inquiries, please reach out to the project owner: Rajat (rajatxt@proton.me)
