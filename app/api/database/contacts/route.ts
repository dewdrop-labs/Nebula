import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { user_email, contact_name, contact_email } = req.body;

    try {
      const client = await pool.connect();
      const query = 'INSERT INTO contacts (user_email, contact_name, contact_email) VALUES ($1, $2, $3)';
      const values = [user_email, contact_name, contact_email];
      await client.query(query, values);
      client.release();

      res.status(200).json({ message: 'Contact saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving contact' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
