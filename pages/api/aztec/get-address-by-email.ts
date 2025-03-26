/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/aztec/get-address-by-email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { createPXEClient, waitForPXE } from '@aztec/aztec.js';
import { getNebulaContract, hashEmail } from './register-user';

const { PXE_URL = 'http://localhost:8080' } = process.env;


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

    // Get user address by email hash
    const userAddress = await nebulaContract.methods
      .get_user_address(emailHash)
      .simulate();
    
    return res.status(200).json({ 
      success: true, 
      userAddress: userAddress.toString(),
      emailHash: emailHash.toString()
    });
  } catch (error: any) {
    console.error('Error getting address by email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to get address by email',
      error: error.message || String(error)
    });
  }
}