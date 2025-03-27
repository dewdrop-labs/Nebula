/* eslint-disable @typescript-eslint/no-explicit-any */
import { NebulaContractArtifact } from '@/contracts/src/artifacts/Nebula';
import { AztecAddress } from '@aztec/aztec.js';
import { Contract } from '@aztec/aztec.js';
import { readFileSync } from 'fs';

export async function getToken(wallet: any) {
  try {
    const addressesPath = 'addresses.json';
    const fileContents = readFileSync(addressesPath, 'utf8');
    const addresses = JSON.parse(fileContents);

    if (!addresses.nebula) {
      throw new Error('No Nebula contract address found in addresses.json');
    }

    // Use the Nebula contract address directly
    return Contract.at(AztecAddress.fromString(addresses.nebula), NebulaContractArtifact, wallet);
  } catch (error) {
    console.error('Error in getToken:', error);
    throw error;
  }
}