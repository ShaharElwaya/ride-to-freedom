// pages/api/options.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const options = await sql`SELECT name, gender, id FROM public.patient;`;
            res.status(200).json(options.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).end();
    }
}