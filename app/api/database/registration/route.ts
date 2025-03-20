/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { createAztecWallet } from "../create-wallet/route";

export const POST = async (req: Request) => {
  const { googleEmail, googleSub, lastLogin } = await req.json();
  
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
      
      return NextResponse.json(updatedUser.rows[0]);
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
    return NextResponse.json(newUser.rows[0]);
    
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to register user", details: error.message },
      { status: 500 }
    );
  }
};