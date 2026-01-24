const fs = require('fs');
try {
    const content = fs.readFileSync('node_modules/nativewind/dist/style-sheet/runtime.js', 'utf8');
    fs.writeFileSync('temp_nw_runtime.js', content);
    console.log('Success reading style-sheet/runtime.js');
} catch (e) {
    console.error(e);
}
