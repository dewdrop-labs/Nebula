import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { userEmail, contactName, contactEmail } = await req.json();

  const result = await sql`
        INSERT INTO contacts (user_email, contact_name, contact_email) VALUES (${userEmail}, ${contactName}, ${contactEmail}) RETURNING *
    `;

  return NextResponse.json(result.rows[0]);
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  const contacts = await sql`
        SELECT * FROM contacts WHERE user_email = ${userEmail}
        `;

  return NextResponse.json(contacts.rows);
};

export const DELETE = async (req: Request) => {
  const { id } = await req.json();

  const result = await sql`
            DELETE FROM contacts WHERE id = ${id} RETURNING *
        `;

  return NextResponse.json(result.rows[0]);
};
