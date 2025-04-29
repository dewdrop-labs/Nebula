/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';
import { initPXE, nebulaContract } from '@/pages/pxeClient';
import { hashEmail } from './register-user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { email } = req.body;
    
    if (email !== session.user.email) {
      return res.status(403).json({ success: false, message: 'Forbidden: Email mismatch' });
    }

    await initPXE(); // only initializes once

    const emailHash = hashEmail(email);

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
