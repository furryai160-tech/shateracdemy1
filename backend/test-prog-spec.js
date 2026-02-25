require('dotenv').config();
const { Client } = require('pg');

async function testProg() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const res = await client.query('SELECT * FROM "LessonProgress" WHERE "userId" = $1', ['9fdadadc-4ad4-458e-a739-9c9e0001347f']);
    console.log("Logged student progress:", res.rows);
    await client.end();
}
testProg();
