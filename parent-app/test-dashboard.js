const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://tknyoztmsdqotygxcihw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbnlvenRtc2Rxb3R5Z3hjaWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDUzMjYsImV4cCI6MjA4NjkyMTMyNn0.xjBXAVNHpvxlWSw2JQvNwHWPYumtE3uQZwPI8htKPdU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const userId = '64d4573a-93ff-4209-ba1b-ff01c96afd4c';

    const { data: prog } = await supabase.from('LessonProgress').select('*').eq('userId', userId).eq('isCompleted', true);
    console.log('Progress:', prog);

    const { data: enr } = await supabase.from('Enrollment').select('courseId, progress, Course(id, title, tenantId, price, Tenant(name), Lesson(id))').eq('userId', userId);
    console.log('Enr:', JSON.stringify(enr, null, 2));
}

test();
