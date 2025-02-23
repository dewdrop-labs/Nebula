// import { sql } from "@vercel/postgres";

import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { walletAddress, googleEmail, googleSub, lastLogin } = await req.json();

  console.log(walletAddress, googleEmail, googleSub, lastLogin);

  /**Uncomment the user const and the return when the database is ready */
  /**If you uncomment this is going to have an error when you try to register */
  
  // const user =
  //   await sql`INSERT INTO users (wallet_address, google_email, google_sub, last_login) VALUES (${walletAddress}, ${googleEmail}, ${googleSub}, ${lastLogin}) RETURNING *`;

  // return NextResponse.json(user.rows[0]);
  return NextResponse.json(true)
};
