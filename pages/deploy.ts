import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { createPXEClient, waitForPXE } from '@aztec/aztec.js';
import { writeFileSync } from 'fs';
import { NebulaContract } from '../contracts/src/artifacts/Nebula';

const PXE_URL = process.env.PXE_URL || 'http://localhost:8080';

async function main() {
  console.log('Connecting to PXE...');
  const pxe = createPXEClient(PXE_URL);
  const pxe_start = await waitForPXE(pxe);
  console.log('pxe start', pxe_start);
  
  console.log('Getting test accounts...');
  const [ownerWallet] = await getInitialTestAccountsWallets(pxe);
  const ownerAddress = ownerWallet.getAddress();
  console.log(`Using owner address: ${ownerAddress.toString()}`);
  
  console.log('Deploying Nebula contract...');
  const nebula = await NebulaContract.deploy(
    ownerWallet,
    ownerAddress,
    'NEBULA',
    'NEB',
    18
  )
  .send()
  .deployed();
  
  console.log(`Contract deployed at ${nebula.address.toString()}`);
  
  const addresses = { nebula: nebula.address.toString() };
  writeFileSync('addresses.json', JSON.stringify(addresses, null, 2));
}

main().catch((err) => {
  console.error(`Error in deployment script: ${err}`);
  process.exit(1);
});