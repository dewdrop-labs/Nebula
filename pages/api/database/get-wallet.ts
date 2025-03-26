// pages/api/database/get-wallet.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the request body to get the email
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email provided' });
    }

    // Retrieve the user's wallet address
    const userWallet = await sql`
      SELECT wallet_address 
      FROM users 
      WHERE google_email = ${email} 
      LIMIT 1
    `;
    
    // If no wallet found, return null
    if (userWallet.rows.length === 0) {
      return res.status(404).json(null);
    }
    
    // Return the wallet address
    return res.status(200).json({ wallet_address: userWallet.rows[0].wallet_address });

  } catch (error) {
    console.error('Error retrieving user wallet:', error);
    return res.status(500).json({ error: 'Failed to retrieve wallet address' });
  }
}