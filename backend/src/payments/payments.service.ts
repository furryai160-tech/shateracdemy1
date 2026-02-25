
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (secretKey) {
            this.stripe = new Stripe(secretKey, {
                apiVersion: '2024-06-20' as any, // Suppress strict version check
            });
        } else {
            console.warn('STRIPE_SECRET_KEY not configured');
        }
    }

    async createCheckoutSession(userId: string, courseId: string) {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';

        // Mock Checkout for Development if Stripe is missing
        if (!this.stripe) {
            console.warn('Stripe not configured. Using Mock Checkout.');
            // Return a success URL with a mock session ID
            return {
                url: `${frontendUrl}/enroll/success?session_id=mock_session_${Date.now()}&course_id=${courseId}&mock=true`
            };
        }

        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            throw new BadRequestException('Course not found');
        }

        // Check if free
        if (Number(course.price) === 0) {
            return { url: `${frontendUrl}/enroll/success?course_id=${courseId}&free=true` };
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd', // Or egp
                        product_data: {
                            name: course.title,
                            description: course.description?.substring(0, 255),
                            images: course.thumbnail ? [course.thumbnail] : [],
                        },
                        unit_amount: Math.round(Number(course.price) * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${frontendUrl}/enroll/success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`,
            cancel_url: `${frontendUrl}/courses/${courseId}?canceled=true`,
            metadata: {
                userId,
                courseId,
            },
        });

        return { url: session.url };
    }

    async verifySession(sessionId: string) {
        // Handle Mock Session Verification
        if (sessionId.startsWith('mock_session_')) {
            return true;
        }

        if (!this.stripe) {
            // If stripe is missing but we got a non-mock session (unlikely), fail safely or allow if in dev mode?
            // Safer to throw or return false if we can't verify.
            // But since we are mocking above, we should be fine returning false for real IDs if stripe is missing.
            console.warn('Payment verification attempted without Stripe configuration');
            return false;
        }

        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId);
            return session.payment_status === 'paid';
        } catch (error) {
            console.error('Error verifying session:', error);
            return false;
        }
    }
}
