require('dotenv').config();
const { Client } = require('pg');

async function checkYaseen() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        const res = await client.query(`SELECT * FROM "User" WHERE phone = '0112095566';`);
        console.log("Yaseen:", res.rows[0]);
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
checkYaseen();
