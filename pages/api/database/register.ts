// pages/api/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from "@vercel/postgres";
import bcrypt from 'bcrypt';
import { createAztecWallet } from './create-wallet';

// Define the type for the request body
interface RegisterRequestBody {
    email: string;
    password: string;
    name?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password, name }: RegisterRequestBody = req.body;

        // Validate the input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user already exists
        const existingUser = await sql`
            SELECT * FROM users WHERE google_email = ${email} LIMIT 1
        `;

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create an Aztec wallet for the user
        const walletAddress = await createAztecWallet(email);

        // Insert the new user into the database
        const newUser = await sql`
            INSERT INTO users (
                google_email, 
                google_sub,
                password, 
                wallet_address, 
                name, 
                last_login
            ) 
            VALUES (
                ${email},
                ${null}, 
                ${hashedPassword}, 
                ${walletAddress.walletAddress}, 
                ${name || null}, 
                CURRENT_TIMESTAMP
            ) 
            RETURNING id, google_email, wallet_address, name, created_at, last_login
        `;
        
        console.log(`New user registered: ${email} with wallet ${walletAddress.walletAddress}`);

        // Register the user on the Aztec contract
        try {
            const registerOnContract = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/aztec/register-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email,
                    walletAddress: walletAddress.walletAddress 
                }),
            });

            if (!registerOnContract.ok) {
                console.warn('Warning: User created but contract registration failed:', 
                    await registerOnContract.text());
            }
        } catch (contractError) {
            console.warn('Warning: User created but contract registration failed:', contractError);
            // Continue with user creation even if contract registration fails
        }

        return res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}