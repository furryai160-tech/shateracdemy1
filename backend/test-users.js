const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    const users = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        select: { id: true, name: true, phone: true, parentPhone: true },
        take: 5
    });
    console.log(users);
}

test().catch(console.error).finally(() => prisma.$disconnect());
