const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const courses = await prisma.course.findMany({ include: { tenant: true } });
    console.log(JSON.stringify(courses.map(c => ({ id: c.id, title: c.title, tenantId: c.tenantId, tenantName: c.tenant ? c.tenant.name : null, isPublished: c.isPublished })), null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
