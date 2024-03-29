// ParentIdToName.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const { summary, date, patientId, id } = req.body;

  if (req.method === "POST") {
    try {
      const result = await sql`
        INSERT INTO public.home_events(event, event_date, patient_id, parent_id)
        VALUES (${summary}, ${date}, ${patientId}, ${id})
        RETURNING *;`;

      const newEvent = result.rows[0];

      res.status(200).json({ event: newEvent });
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
