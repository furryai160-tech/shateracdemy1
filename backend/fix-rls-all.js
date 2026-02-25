require('dotenv').config();
const { Client } = require('pg');

async function testRLSAll() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        const tables = ['Enrollment', 'User', 'Course', 'Tenant', 'Lesson', 'LessonProgress'];
        for (const tbl of tables) {
            await client.query(`ALTER TABLE "${tbl}" ENABLE ROW LEVEL SECURITY;`);
            await client.query(`DROP POLICY IF EXISTS "Allow anon read ${tbl}" ON "${tbl}";`);
            await client.query(`CREATE POLICY "Allow anon read ${tbl}" ON "${tbl}" FOR SELECT USING (true);`);
        }

        console.log("RLS policies added for all required tables to ensure no blocks.");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

testRLSAll();
