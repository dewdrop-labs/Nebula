# Aztec Wallet Integration

This document explains how we integrated Aztec wallet creation into Nebula, allowing for automated account creation during user registration.

## Overview

The integration allows your application to:
- Create Aztec accounts programmatically during user registration
- Store wallet information securely
- Handle the complexities of the Aztec CLI
- Prevent duplicate wallet creation for existing users

## Prerequisites

- Node.js 14.x or later
- Next.js application
- Docker installed and running
- Aztec Sandbox installed

## Installation

1. Install the Aztec toolchain:
   ```bash
   bash -i <(curl -s https://install.aztec.network)
   ```

2. Install required dependencies:
   ```bash
   npm install child_process fs path util
   ```

3. For MacOS users, install socat:
   ```bash
   brew install socat
   ```

4. Start the Aztec sandbox:
   ```bash
   aztec start --sandbox
   ```

## How to setup this project

 1. fork and clone the repository

 2. run the npm installation command
  ```bash
  npm install
  ```

3. make sure to start your docker engine and the aztec sandbox. Install the sandbox if you haven't
```bash
aztec start --sandbox
``` 

4. run the app on development 
```bash
npm run dev
```

5. visit the local development url and register or login with Google to get access to all the features.

###Happy Hacking



## Maintenance

### Updating Aztec

To update the Aztec toolchain:

```bash
aztec-up
```

### Checking Wallet Information

To verify wallet information for a user directly from the CLI:

```bash
aztec-wallet get-alias accounts:<alias>
```

### Troubleshooting

If you encounter issues:

1. Ensure the Aztec sandbox is running: `aztec status`
2. Restart the sandbox: `aztec stop && aztec start --sandbox`
3. Check for errors in the logs: `aztec logs`
4. Try creating a wallet manually to verify the CLI works: `aztec-wallet create-account -a test-account -payment method=fee_juice,feePayer=test0`