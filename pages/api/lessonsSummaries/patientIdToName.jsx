// patientIdToName.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { patient_id } = req.query;

      const name =
        await sql`SELECT name, gender FROM public.patient where id=${patient_id};`;

      res.status(200).json(name.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
