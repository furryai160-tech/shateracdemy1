require('dotenv').config();
const { Client } = require('pg');

async function fixAhmed() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        const courses = await client.query('SELECT id FROM "Course" WHERE "tenantId" = \'fb4824e1-15fb-4d2b-ade2-dff43574a49b\';');
        for (const course of courses.rows) {
            await client.query(`
        INSERT INTO "Enrollment" ("id", "userId", "courseId", "progress", "createdAt", "updatedAt") 
        VALUES (gen_random_uuid(), '97d791f1-1d03-43bf-99fa-ce815f505db7', $1, 0, now(), now())
        ON CONFLICT DO NOTHING;
      `, [course.id]);
        }
        console.log("Ahmed is now enrolled in " + courses.rows.length + " courses.");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
fixAhmed();
