require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({ select: { id: true, name: true, phone: true, parentPhone: true, role: true } });
        console.log(`Found ${users.length} users in DB.`);
        console.log(users.slice(0, 5));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
