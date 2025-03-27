/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from 'next';
import { createAztecWallet } from "./create-wallet";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { googleEmail, googleSub, lastLogin } = req.body;
  
  try {
    // First, check if the user already exists in the database
    const existingUser = await sql`
      SELECT * FROM users WHERE google_email = ${googleEmail} OR google_sub = ${googleSub} LIMIT 1
    `;
    
    // If the user exists, update their last login time and return the existing user
    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      
      // Update the last login time
      const updatedUser = await sql`
        UPDATE users 
        SET last_login = ${lastLogin} 
        WHERE id = ${user.id} 
        RETURNING *
      `;
      
      return res.status(200).json(updatedUser.rows[0]);
    }
    
    // If the user doesn't exist, create a new wallet
    const walletAddress = await createAztecWallet(googleEmail);
    
    // Insert the new user into the database
    const newUser = await sql`
      INSERT INTO users (
        wallet_address, 
        google_email, 
        google_sub, 
        last_login
      ) 
      VALUES (
        ${walletAddress.walletAddress}, 
        ${googleEmail}, 
        ${googleSub}, 
        ${lastLogin}
      ) 
      RETURNING *
    `;
    
    console.log(`New user created for ${googleEmail} with wallet ${walletAddress.walletAddress}`);
    const register_user_on_contract =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/aztec/register-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: googleEmail,
          walletAddress: walletAddress.walletAddress 
        }),
      });

     
if (!register_user_on_contract.ok) {
    console.error('Failed to register user on contract:', await register_user_on_contract.text());
    // Decide whether to continue or throw an error
  }
    
    return res.status(200).json(newUser.rows[0]);
    
  } catch (error: any) {
    return res.status(500).json({ 
      error: "Failed to register user", 
      details: error.message 
    });
  }
}