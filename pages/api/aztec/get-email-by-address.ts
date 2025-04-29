/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';
import { AztecAddress } from '@aztec/aztec.js';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { createPXEClient, waitForPXE } from '@aztec/aztec.js';
import { getNebulaContract } from './register-user';


//const { PXE_URL = 'http://localhost:8080' } = process.env;
const { PXE_URL = process.env.L2_NODE || "https://l2.testnet.nemi.fi"} = process.env;


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Verify the user is authenticated
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ success: false, message: 'Wallet address is required' });
    }

    // Connect to Aztec
    const pxe = createPXEClient(PXE_URL);
    await waitForPXE(pxe);

    // Create user address
    const userAddress = AztecAddress.fromString(walletAddress);

    // Get the contract owner wallet
    const [ownerWallet] = await getInitialTestAccountsWallets(pxe);

    console.log('owner wallet', ownerWallet)
    
    // Get the contract
    const nebulaContract = await getNebulaContract(ownerWallet);

    // Get email hash by address
    const emailHash = await nebulaContract.methods
      .get_user_email(userAddress)
      .simulate();

    console.log('email hash', emailHash)
    
    return res.status(200).json({ 
      success: true, 
      emailHash: emailHash.toString(),
      walletAddress
    });
  } catch (error: any) {
    console.error('Error getting email by address:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to get email by address',
      error: error.message || String(error)
    });
  }
}