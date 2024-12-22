const mysql=require('mysql2');
// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dbms123',
    database: 'attdatabase'
});

module.exports=db;