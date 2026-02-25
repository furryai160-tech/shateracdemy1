const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://tknyoztmsdqotygxcihw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbnlvenRtc2Rxb3R5Z3hjaWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDUzMjYsImV4cCI6MjA4NjkyMTMyNn0.xjBXAVNHpvxlWSw2JQvNwHWPYumtE3uQZwPI8htKPdU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetchYaseen() {
    const userId = 'c0e865ef-b25b-4d31-b3f8-84b47c128067'; // user "ليتاغعتل" who has 4 watched lessons

    const { data: completedProgs, error: err1 } = await supabase
        .from('LessonProgress')
        .select('*')
        .eq('userId', userId)
        .eq('isCompleted', true);
    console.log("Completed Progs:", completedProgs?.length, err1);

    const { data: enrollmentsData, error: err2 } = await supabase
        .from('Enrollment')
        .select(`
          courseId,
          Course(
            tenantId,
            price,
            Lesson ( id ),
            Tenant ( name )
          )
        `)
        .eq('userId', userId);
    console.log("Enrollment details for user:", err2);
    console.log(JSON.stringify(enrollmentsData, null, 2));
}

testFetchYaseen();
