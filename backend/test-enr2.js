require('dotenv').config();
const { Client } = require('pg');

async function check() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        const res = await client.query('SELECT u.name, u.phone, u."parentPhone", COUNT(e.id) as courses FROM "Enrollment" e JOIN "User" u ON e."userId" = u.id GROUP BY u.name, u.phone, u."parentPhone";');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
check();
