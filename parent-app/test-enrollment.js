const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://tknyoztmsdqotygxcihw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbnlvenRtc2Rxb3R5Z3hjaWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDUzMjYsImV4cCI6MjA4NjkyMTMyNn0.xjBXAVNHpvxlWSw2JQvNwHWPYumtE3uQZwPI8htKPdU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data, error } = await supabase.from('Enrollment').select('courseId, Course(tenantId, title)');
    console.log('Enrollments:', JSON.stringify(data, null, 2));
    console.log('Error:', error);
}

test();
