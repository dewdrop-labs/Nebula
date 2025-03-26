// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from "@vercel/postgres";
import bcrypt from 'bcrypt';

// Define the type for the request body
interface LoginRequestBody {
    email: string;
    password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password }: LoginRequestBody = req.body;

        // Validate the input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Query the database to find the user
        const result = await sql`
            SELECT * FROM users WHERE google_email = ${email}
        `;

        // Check if the user exists
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Update last login timestamp
        await sql`
            UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}
        `;

        // Return the success response with user data (excluding sensitive information)
        const userData = {
            id: user.id,
            wallet_address: user.wallet_address,
            google_email: user.google_email,
            created_at: user.created_at,
            last_login: user.last_login,
        };

        return res.status(200).json({
            message: 'Login successful',
            user: userData
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}