const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://tknyoztmsdqotygxcihw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbnlvenRtc2Rxb3R5Z3hjaWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDUzMjYsImV4cCI6MjA4NjkyMTMyNn0.xjBXAVNHpvxlWSw2JQvNwHWPYumtE3uQZwPI8htKPdU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetchAll() {
    const { data: users, error: userError } = await supabase.from('User').select('id, name, phone, parentPhone');
    if (userError) return console.error("User fetch error:", userError);

    console.log(`Found ${users.length} users in Supabase`);

    for (const u of users) {
        const { data: enr, error: enrError } = await supabase
            .from('Enrollment')
            .select('courseId, Course ( title, Tenant ( name ) )')
            .eq('userId', u.id);

        if (enr && enr.length > 0) {
            console.log(`User: ${u.name} (Phone: ${u.phone}) has ${enr.length} enrollments.`);
            console.log(JSON.stringify(enr, null, 2));
        }
    }
}

testFetchAll();
