/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/aztec/mint-tokens.ts
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
    const { email, amount } = req.body;
    
    // Verify the email in the request matches the authenticated user's email
    if (email !== session.user.email) {
      return res.status(403).json({ success: false, message: 'Forbidden: Email mismatch' });
    }

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    // Convert amount to BigInt
    const amountBigInt = BigInt(amount);

    // Connect to Aztec
    const pxe = createPXEClient(PXE_URL);
    await waitForPXE(pxe);

    // Get the contract owner wallet
    const [ownerWallet] = await getInitialTestAccountsWallets(pxe);
    
    // Get the contract
    const nebulaContract = await getNebulaContract(ownerWallet);

    // Hash the email
    const emailHash = hashEmail(email);

    // Mint tokens to the user identified by email hash
    const tx = await nebulaContract.methods
      .mint_by_email(emailHash, amountBigInt)
      .send();
    
    const receipt = await tx.wait();
    
    return res.status(200).json({ 
      success: true, 
      message: `Minted ${amountBigInt.toString()} tokens successfully`,
      txHash: receipt.txHash,
      emailHash: emailHash.toString()
    });
  } catch (error: any) {
    console.error('Error minting tokens:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to mint tokens',
      error: error.message || String(error)
    });
  }
}