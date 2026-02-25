
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const password = await bcrypt.hash('password123', 10);

    const tenant = await prisma.tenant.upsert({
        where: { subdomain: 'default-academy' },
        update: {},
        create: {
            name: 'Default Academy',
            subdomain: 'default-academy',
            customDomain: 'academy.local',
        },
    });

    const admin = await prisma.user.upsert({
        where: { email: 'admin@academy.local' },
        update: {},
        create: {
            email: 'admin@academy.local',
            name: 'Admin User',
            password,
            role: 'SUPER_ADMIN',
            tenantId: tenant.id,
        },
    });

    console.log({ tenant, admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
