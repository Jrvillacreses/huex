const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
db.get('SELECT id, email, username FROM user WHERE email = "a24175@svalero.com"', (err, row) => {
    console.log(JSON.stringify(row, null, 2));
    db.close();
});
