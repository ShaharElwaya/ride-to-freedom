// addComment.jsx

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { lessonId, comment, id, type } = req.body;

      // Insert the comment into the database
      const result = await sql`
        INSERT INTO public.lessons_comments (user_type, user_id, comment, summary_id)
        VALUES (${type}, ${id}, ${comment}, ${lessonId})
        RETURNING *;
      `;

      const insertedComment = result.rows[0];

      res.status(200).json({ success: true, comment: insertedComment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).end();
  }
}
