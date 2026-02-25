require('dotenv').config();
const { Client } = require('pg');

async function checkProgress() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        const res = await client.query(`
      SELECT u.name, u.phone, COUNT(lp.id) as watched_lessons
      FROM "User" u
      JOIN "LessonProgress" lp ON u.id = lp."userId"
      WHERE lp."isCompleted" = true
      GROUP BY u.name, u.phone
      ORDER BY watched_lessons DESC;
    `);
        console.log("Users with watched lessons:", res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
checkProgress();
