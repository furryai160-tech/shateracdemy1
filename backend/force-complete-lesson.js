require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const userId = '97d791f1-1d03-43bf-99fa-ce815f505db7'; // احمد محمد العوامي
    const lessonId = 'd82701ce-2e4a-4a7b-aedb-87723af825cf'; // A random lesson from course 'تنارتنا' ?

    // First let's find a lesson from his enrolled courses
    const enr = await prisma.enrollment.findFirst({
        where: { userId },
        include: { course: { include: { lessons: true } } }
    });

    if (enr && enr.course.lessons.length > 0) {
        const targetLesson = enr.course.lessons[0];
        console.log("Marking lesson as complete:", targetLesson.title);

        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId: targetLesson.id
                }
            },
            update: { isCompleted: true },
            create: {
                userId,
                lessonId: targetLesson.id,
                isCompleted: true
            }
        });

        console.log("Successfully marked complete!");
    } else {
        console.log("No lessons found for his enrolled courses.");
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
