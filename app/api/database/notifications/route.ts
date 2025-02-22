import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { userEmail, message } = await req.json();

  const result = await sql`
        INSERT INTO notifications (user_email, message) VALUES (${userEmail}, ${message}) RETURNING *
    `;

  return NextResponse.json(result.rows[0]);
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  const notifications = await sql`
        SELECT * FROM notifications WHERE user_email = ${userEmail}
        `;

  return NextResponse.json(notifications.rows);
};
