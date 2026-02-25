const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, 'src/app/admin/tenants/[id]/page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Remove 3. Hero Section
const heroSectionStart = '{/* 3. Hero Section (WordPress Style) */}';
const targetStart1 = content.indexOf(heroSectionStart);
if (targetStart1 !== -1) {
    const heroSectionEnd = '{/* 4. Display, Theme & Layout */}';
    const targetEnd1 = content.indexOf(heroSectionEnd);
    if (targetEnd1 !== -1) {
        // Find previous newline to remove cleanly
        const blockStart = content.lastIndexOf('\n', targetStart1) + 1;
        const blockEnd = content.lastIndexOf('\n', targetEnd1) + 1;
        content = content.slice(0, blockStart) + content.slice(blockEnd);
    }
}

// 2. Remove features and courses switches
// Looking for exactly: `<div className="flex items-center justify-between">\n                            <span className="text-sm font-medium">عرض قسم المميزات</span>`
const featureStartStr = '<span className="text-sm font-medium">عرض قسم المميزات</span>';
const targetStart2Str = content.indexOf(featureStartStr);
if (targetStart2Str !== -1) {
    // Traverse backwards to the start of the div
    const targetStart2 = content.lastIndexOf('<div className="flex items-center justify-between">', targetStart2Str);

    // End is before footer
    const footerStr = '<span className="text-sm font-medium">عرض التذييل (Footer)</span>';
    const targetEnd2Str = content.indexOf(footerStr);
    const targetEnd2 = content.lastIndexOf('<div className="flex items-center justify-between">', targetEnd2Str);

    if (targetStart2 !== -1 && targetEnd2 !== -1) {
        content = content.slice(0, targetStart2) + content.slice(targetEnd2);
    }
}

// 3. Remove 5. Motion
const motionStartStr = '{/* 5. Motion & Animation */}';
const targetStart3Str = content.indexOf(motionStartStr);
if (targetStart3Str !== -1) {
    const motionStart = content.lastIndexOf('\n', targetStart3Str) + 1;
    const socialStartStr = '{/* 6. Social Media */}';
    const targetEnd3Str = content.indexOf(socialStartStr);
    const motionEnd = content.lastIndexOf('\n', targetEnd3Str) + 1;

    if (motionStart !== -1 && motionEnd !== -1) {
        content = content.slice(0, motionStart) + content.slice(motionEnd);
    }
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Replacements complete.');
