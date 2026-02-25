
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

function getEnv(key: string): string | undefined {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
        if (match) {
            let val = match[1].trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            return val;
        }
    }
    return process.env[key];
}

async function main() {
    const connectionString = getEnv('DATABASE_URL');
    if (!connectionString) {
        console.error('DATABASE_URL not found');
        return;
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        // Retrieve a tenant ID to simulate a logged-in teacher
        const tenant = await prisma.tenant.findFirst();
        console.log('Testing with Tenant ID:', tenant?.id);

        if (!tenant) {
            console.log('No tenants found. Testing with undefined tenantId (Admin mode)');
        }

        const tenantId = tenant?.id;

        console.log('--- Simulating getPendingRequests ---');

        const where: any = { type: 'DEPOSIT', status: 'PENDING' };

        if (tenantId) {
            // Using the exact logic from the service
            where.user = {
                OR: [
                    { tenantId: tenantId },
                    { tenantId: null }
                ]
            };
        }

        console.log('Query where:', JSON.stringify(where, null, 2));

        const results = await prisma.walletTransaction.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true, tenantId: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log('Results found:', results.length);
        results.forEach((r: any) => {
            console.log(`- Request ${r.id}: User ${r.user.email} (Tenant: ${r.user.tenantId})`);
        });

        const missing = await prisma.walletTransaction.findFirst({
            where: {
                user: { email: 'furryai160@gmail.com' }
            },
            include: { user: true }
        });
        if (missing) {
            console.log('\n--- Debugging missing user ---');
            console.log('Found transaction:', missing.id);
            console.log('Status:', missing.status);
            console.log('Type:', missing.type);
            console.log('User TenantId:', missing.user.tenantId);
        }

        if (results.length === 0) {
            console.log('WARNING: No results found!');
            // Check if there are ANY pending requests at all
            const allPending = await prisma.walletTransaction.count({ where: { type: 'DEPOSIT', status: 'PENDING' } });
            console.log('Total PENDING DEPOSIT requests in DB (ignoring filters):', allPending);
        }


        // List all users
        console.log('\n--- ALL USERS ---');
        const allUsers = await prisma.user.findMany();
        allUsers.forEach((u: any) => {
            console.log(`- ${u.email} (Tenant: ${u.tenantId}, Role: ${u.role})`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
