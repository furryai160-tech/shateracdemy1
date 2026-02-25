import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.liveSession.findFirst({ orderBy: { createdAt: 'desc' } })
    .then(s => console.log('Latest session:', s))
    .catch(console.error)
    .finally(() => prisma.$disconnect());
