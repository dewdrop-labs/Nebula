/* eslint-disable @typescript-eslint/no-explicit-any */
// pxeClient.ts (new file)
import { createPXEClient, waitForPXE } from '@aztec/aztec.js';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { getNebulaContract } from './api/aztec/register-user';

const { PXE_URL = process.env.L2_NODE || "https://l2.testnet.nemi.fi" } = process.env;

let pxe: ReturnType<typeof createPXEClient> | undefined;
let ownerWallet: any;
let nebulaContract: any;

async function initPXE() {
  if (!pxe) {
    pxe = createPXEClient(PXE_URL);
    await waitForPXE(pxe);
    [ownerWallet] = await getInitialTestAccountsWallets(pxe);
    nebulaContract = await getNebulaContract(ownerWallet);
  }
}

export { initPXE, pxe, ownerWallet, nebulaContract };
