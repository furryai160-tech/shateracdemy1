require('dotenv').config();
const { Client } = require('pg');

async function testRLS() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        // Course
        await client.query('ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;');
        await client.query('DROP POLICY IF EXISTS "Allow anon read Course" ON "Course";');
        await client.query('CREATE POLICY "Allow anon read Course" ON "Course" FOR SELECT USING (true);');

        // Quiz
        await client.query('ALTER TABLE "Quiz" ENABLE ROW LEVEL SECURITY;');
        await client.query('DROP POLICY IF EXISTS "Allow anon read Quiz" ON "Quiz";');
        await client.query('CREATE POLICY "Allow anon read Quiz" ON "Quiz" FOR SELECT USING (true);');

        console.log("RLS policies added for Course and Quiz");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

testRLS();
