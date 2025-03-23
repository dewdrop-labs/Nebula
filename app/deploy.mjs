/* eslint-disable @typescript-eslint/no-explicit-any */
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { Contract, createPXEClient, loadContractArtifact, waitForPXE } from '@aztec/aztec.js';
import NebulaContractJson from "../contracts/target/nebula-Nebula.json" with { type: "json" };
import { writeFileSync } from 'fs';

const NebulaContractArtifact = loadContractArtifact(NebulaContractJson);

const { PXE_URL = 'http://localhost:8080' } = process.env;

async function main() {
  const pxe = createPXEClient(PXE_URL);
  await waitForPXE(pxe);

  const [ownerWallet] = await getInitialTestAccountsWallets(pxe);
  const ownerAddress = ownerWallet.getAddress();

  const Nebula = await Contract.deploy(ownerWallet, NebulaContractArtifact, [ownerAddress])
    .send()
    .deployed();

  console.log(`Contract deployed at ${Nebula.address.toString()}`);

  const addresses = { token: Nebula.address.toString() };
  writeFileSync('addresses.json', JSON.stringify(addresses, null, 2));
}

main().catch((err) => {
  console.error(`Error in deployment script: ${err}`);
  process.exit(1);
});