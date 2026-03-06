const fs = require('fs');
fs.writeFileSync('tailwind.debug.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;
`);
