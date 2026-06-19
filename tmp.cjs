const fs = require('fs');
const content = fs.readFileSync('public/site/data.js', 'utf-8');
const matches = [...content.matchAll(/"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)"/g)];
matches.forEach(m => console.log(m[1] + ' === ' + m[2]));
