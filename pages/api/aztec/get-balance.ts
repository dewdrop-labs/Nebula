/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { createPXEClient, waitForPXE } from '@aztec/aztec.js';
import { getNebulaContract, hashEmail } from './register-user';

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
    const { email } = req.body;
    
    // Verify the email in the request matches the authenticated user's email
    if (email !== session.user.email) {
      return res.status(403).json({ success: false, message: 'Forbidden: Email mismatch' });
    }

    // Connect to Aztec
    const pxe = createPXEClient(PXE_URL);
    await waitForPXE(pxe);

    // Get the contract owner wallet
    const [ownerWallet] = await getInitialTestAccountsWallets(pxe);
    
    // Get the contract
    const nebulaContract = await getNebulaContract(ownerWallet);

    // Hash the email
    const emailHash = hashEmail(email);

    // First get the user address from email hash
    const userAddress = await nebulaContract.methods
      .get_user_address(emailHash)
      .simulate();
    
    // Then get the balance for that address
    const balance = await nebulaContract.methods
      .balance_of_public(userAddress)
      .simulate();
    
    return res.status(200).json({ 
      success: true, 
      balance: balance.toString(),
      userAddress: userAddress.toString(),
      emailHash: emailHash.toString()
    });
  } catch (error: any) {
    console.error('Error getting balance:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to get balance',
      error: error.message || String(error)
    });
  }
}