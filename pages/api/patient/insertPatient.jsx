// insertPatient.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      parent_id,
      name,
      address,
      birthday,
      gender,
      id,
      reason_for_request,
    } = req.body;
    try {
      const options = await sql`
                INSERT INTO public.patient (id, name, address, birthday, gender, parent_id, reason_for_request)
                VALUES (${id}, ${name}, ${address}, ${birthday}, ${gender}, ${parent_id}, ${reason_for_request})
                RETURNING *;`;

      res.status(200).json(options.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
