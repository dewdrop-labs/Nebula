import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Define the type for the request body
interface LoginRequestBody {
    email: string;
    password: string;
    }

    export async function POST(request: Request) {
    try {
        const { email, password }: LoginRequestBody = await request.json();

        // Validate the input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Query the database to find the user
        const query = 'SELECT * FROM users WHERE google_email = $1';
        const result = await pool.query(query, [email]);

        // Check if the user exists
        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        const updateQuery = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
        await pool.query(updateQuery, [user.id]);

        // Return the success response with user data (excluding sensitive information)
        const userData = {
            id: user.id,
            wallet_address: user.wallet_address,
            google_email: user.google_email,
            created_at: user.created_at,
            last_login: user.last_login,
        };

        return NextResponse.json(
            { message: 'Login successful', user: userData },
            { status: 200 }
        );

    } catch (error) {
            console.error('Error during login:', error);
            return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}