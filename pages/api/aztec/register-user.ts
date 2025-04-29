/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { AztecAddress } from '@aztec/aztec.js';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { createPXEClient, waitForPXE } from '@aztec/aztec.js';
import { Contract } from '@aztec/aztec.js';
//import { readFileSync } from 'fs';
import { NebulaContractArtifact } from '@/contracts/src/artifacts/Nebula';

//const { PXE_URL = 'http://localhost:8080' } = process.env;
const { PXE_URL = process.env.L2_NODE || "https://l2.testnet.nemi.fi"} = process.env;

// Utility function to hash an email
export function hashEmail(email: string): bigint {
  const normalizedEmail = email.toLowerCase().trim();

  // Create a simple hash that converts to a Field-like representation
  let hash = 0n;
  for (let i = 0; i < normalizedEmail.length; i++) {
    // Use a simple polynomial rolling hash
    hash = (hash * 31n + BigInt(normalizedEmail.charCodeAt(i))) % 2n ** 256n;
  }

  return hash;
}

export async function getNebulaContract(wallet: any) {
  //const addresses = JSON.parse(readFileSync('addresses.json', 'utf8'));
  const nebulaAddress = process.env.NEBULA_CONTRACT_ADDRESS;

  if (!nebulaAddress) {
    throw new Error('Nebula contract address is not defined in the environment variables.');
  }

  console.log('Using Nebula contract address:', nebulaAddress);

  return Contract.at(
    AztecAddress.fromString(nebulaAddress),
    NebulaContractArtifact,
    wallet
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, walletAddress } = req.body;

    // Connect to Aztec
    const pxe = createPXEClient(PXE_URL);
    const pxe_info = await waitForPXE(pxe);
    console.log('pxe info', pxe_info);

    // Create user address
    const userAddress = AztecAddress.fromString(walletAddress);

    // Get the contract owner wallet
    const [ownerWallet] = await getInitialTestAccountsWallets(pxe);
    
    // Get the contract
    const nebulaContract = await getNebulaContract(ownerWallet);

    // Hash the email
    const emailHash = hashEmail(email);

    // Check if user is already registered
    const isRegistered = await nebulaContract.methods
      .check_if_registered(userAddress)
      .simulate();

    if (isRegistered) {
      return res.status(200).json({ 
        success: true, 
        message: 'User is already registered',
        isRegistered: true
      });
    }

    // Register the user
    await nebulaContract.methods
      .register_user_public(emailHash, userAddress)
      .send()
      .wait();

    // Verify registration
    const finalRegistrationStatus = await nebulaContract.methods
      .check_if_registered(userAddress)
      .simulate();
    
    return res.status(200).json({ 
      success: true, 
      message: 'User registered successfully',
      isRegistered: finalRegistrationStatus
    });
  } catch (error: any) {
    console.error('Error registering user:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to register user',
      error: error.message || String(error)
    });
  }
}