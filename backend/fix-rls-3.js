require('dotenv').config();
const { Client } = require('pg');

async function testRLS() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        // Lesson
        await client.query('ALTER TABLE "Lesson" ENABLE ROW LEVEL SECURITY;');
        await client.query('DROP POLICY IF EXISTS "Allow anon read Lesson" ON "Lesson";');
        await client.query('CREATE POLICY "Allow anon read Lesson" ON "Lesson" FOR SELECT USING (true);');

        // Tenant
        await client.query('ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;');
        await client.query('DROP POLICY IF EXISTS "Allow anon read Tenant" ON "Tenant";');
        await client.query('CREATE POLICY "Allow anon read Tenant" ON "Tenant" FOR SELECT USING (true);');

        console.log("RLS policies added for Lesson and Tenant");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

testRLS();
