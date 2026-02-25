require('dotenv').config();
const { Client } = require('pg');

async function testRLS() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        const res = await client.query('SELECT * FROM "User" WHERE role = \'STUDENT\' LIMIT 5;');
        console.log("pg data length:", res.rows.length);
        console.log("sample data:", res.rows[0]);

        // Now disable RLS for testing if the user has requested direct supabase access
        // Or just create a policy
        await client.query('ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;');
        await client.query('DROP POLICY IF EXISTS "Allow anon read User" ON "User";');
        await client.query('CREATE POLICY "Allow anon read User" ON "User" FOR SELECT USING (true);');

        await client.query('ALTER TABLE "QuizResult" ENABLE ROW LEVEL SECURITY;');
        await client.query('DROP POLICY IF EXISTS "Allow anon read QuizResult" ON "QuizResult";');
        await client.query('CREATE POLICY "Allow anon read QuizResult" ON "QuizResult" FOR SELECT USING (true);');

        await client.query('ALTER TABLE "WalletTransaction" ENABLE ROW LEVEL SECURITY;');
        await client.query('DROP POLICY IF EXISTS "Allow anon read WalletTransaction" ON "WalletTransaction";');
        await client.query('CREATE POLICY "Allow anon read WalletTransaction" ON "WalletTransaction" FOR SELECT USING (true);');

        // Enrollments
        await client.query('ALTER TABLE "Enrollment" ENABLE ROW LEVEL SECURITY;');
        await client.query('DROP POLICY IF EXISTS "Allow anon read Enrollment" ON "Enrollment";');
        await client.query('CREATE POLICY "Allow anon read Enrollment" ON "Enrollment" FOR SELECT USING (true);');

        // LessonProgress
        await client.query('ALTER TABLE "LessonProgress" ENABLE ROW LEVEL SECURITY;');
        await client.query('DROP POLICY IF EXISTS "Allow anon read LessonProgress" ON "LessonProgress";');
        await client.query('CREATE POLICY "Allow anon read LessonProgress" ON "LessonProgress" FOR SELECT USING (true);');

        console.log("RLS policies added for tables queried by parent app");

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

testRLS();
