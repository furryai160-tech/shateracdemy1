const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://tknyoztmsdqotygxcihw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbnlvenRtc2Rxb3R5Z3hjaWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDUzMjYsImV4cCI6MjA4NjkyMTMyNn0.xjBXAVNHpvxlWSw2JQvNwHWPYumtE3uQZwPI8htKPdU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    const userId = '9fdadadc-4ad4-458e-a739-9c9e0001347f';

    const { data: completedLessons } = await supabase
        .from('LessonProgress')
        .select('lessonId')
        .eq('userId', userId)
        .eq('isCompleted', true);

    const completedSet = new Set(completedLessons?.map((cl) => cl.lessonId));

    const { data: enrollmentsData, error } = await supabase
        .from('Enrollment')
        .select(`
          courseId,
          Course(
            title,
            tenantId,
            price,
            Lesson ( id ),
            Tenant ( name )
          )
        `)
        .eq('userId', userId);

    let coursesProgressList = [];

    enrollmentsData?.forEach((enrollment) => {
        const course = enrollment.Course;
        if (!course) return;

        const lessons = course.Lesson || [];
        const totalLessons = lessons.length;

        let watchedCount = 0;
        lessons.forEach((lesson) => {
            if (completedSet.has(lesson.id)) {
                watchedCount++;
            }
        });

        coursesProgressList.push({
            id: enrollment.courseId,
            title: course.title,
            teacherName: course.Tenant?.name || 'غير محدد',
            price: course.price,
            watched: watchedCount,
            total: totalLessons
        });
    });
    console.log("coursesProgressList", JSON.stringify(coursesProgressList, null, 2));

    const { data: completedProgs } = await supabase
        .from('LessonProgress')
        .select('*')
        .eq('userId', userId)
        .eq('isCompleted', true);

    console.log("completedProgs (from index.tsx):", completedProgs?.length || 0);
}

testFetch();
