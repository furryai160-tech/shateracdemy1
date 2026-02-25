require('dotenv').config();
const { Client } = require('pg');

async function checkAhmed() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        const res = await client.query('SELECT * FROM "Enrollment" WHERE "userId" = \'97d791f1-1d03-43bf-99fa-ce815f505db7\';');
        console.log("Ahmed Enrollments:", res.rows.length);
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
checkAhmed();
