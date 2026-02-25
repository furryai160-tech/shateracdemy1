require('dotenv').config();
const { Client } = require('pg');

async function fixProgress() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        const res = await client.query(`
      UPDATE "Enrollment" e
      SET progress = (
          SELECT COALESCE(
              (COUNT(lp.id) * 100) / NULLIF(
                  (SELECT COUNT(l.id) FROM "Lesson" l WHERE l."courseId" = e."courseId"), 0
              ), 0
          )
          FROM "LessonProgress" lp
          JOIN "Lesson" l2 ON lp."lessonId" = l2.id
          WHERE lp."userId" = e."userId" AND l2."courseId" = e."courseId" AND lp."isCompleted" = true
      )
      RETURNING e.id, e.progress, e."userId", e."courseId";
    `);
        console.log("Updated enrollments progress column:", res.rows.length);
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
fixProgress();
