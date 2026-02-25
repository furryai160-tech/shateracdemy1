require('dotenv').config();
const { Client } = require('pg');

async function testFetchAll() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        const res = await client.query('SELECT u.id, u.name, u.phone, u."parentPhone", u."tenantId" FROM "User" u WHERE "role" = \'STUDENT\' ORDER BY "createdAt" DESC limit 5;');
        console.log("Recent 5 Students:");
        res.rows.forEach(r => console.log(JSON.stringify(r)));
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

testFetchAll();
