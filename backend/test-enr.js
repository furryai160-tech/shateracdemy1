require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const enr = await prisma.enrollment.findMany({
            include: { user: { select: { id: true, name: true, phone: true, parentPhone: true } } }
        });
        console.log("All Enrollments grouped by user:");
        const map = {};
        for (const e of enr) {
            if (!map[e.user.name]) map[e.user.name] = { user: e.user, courses: 0 };
            map[e.user.name].courses++;
        }
        console.log(JSON.stringify(map, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
