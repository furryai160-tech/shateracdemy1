require('dotenv').config();
const { Client } = require('pg');

async function fixData() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        // 1. Give parent phone to all users so they can login with a test parent phone
        await client.query('UPDATE "User" SET "parentPhone" = \'01228495250\' WHERE "role" = \'STUDENT\' AND "parentPhone" IS NULL;');
        console.log("Updated parent phones");

        // 2. Add an enrollment for user محمد 
        // Check if courses exist
        const cRes = await client.query('SELECT id FROM "Course" LIMIT 2;');
        const uRes = await client.query('SELECT id FROM "User" WHERE phone = \'01129006666\' LIMIT 1;');
        if (cRes.rows.length > 0 && uRes.rows.length > 0) {
            const uId = uRes.rows[0].id;
            for (const course of cRes.rows) {
                await client.query(`
          INSERT INTO "Enrollment" ("id", "userId", "courseId", "progress", "createdAt", "updatedAt") 
          VALUES (gen_random_uuid(), $1, $2, 50, now(), now())
          ON CONFLICT ("userId", "courseId") DO NOTHING;
        `, [uId, course.id]);
            }
            console.log("Enrolled user in courses!");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
fixData();
