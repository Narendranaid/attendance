const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const db=require('./db');
// Middleware
app.use(express.json()); // for parsing application/json
app.use(cors()); // for handling cross-origin requests

let code = '3-CSE-CSE-B';
//db connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const query = 'SELECT * FROM facaulty WHERE facaulty_id = ?';
    // console.log(username)
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Database query error:', err.message); // Log detailed error
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = results[0];
       // console.log(user);
        try {
            // Log the database password for debugging purposes
            //console.log("Hashed password from database:", user.facaulty_pass);
           // console.log("Plain password entered:", password);
  
            // Verify password using argon2
            //const hashedEnteredPassword = await argon2.hash(password);
            const hashedDataPassword = await argon2.hash(user.facaulty_pass);
            const isMatch = await argon2.verify(hashedDataPassword, password);
            //console.log("Password match result:", isMatch);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }const token = jwt.sign({ userId: user.facaulty_id, username: user.facaulty_id }, 'secret_key', { expiresIn: '1h' });

            res.json({ message: 'Login successful', token });
        } catch (err) {
            console.error('Error verifying password:', err.message);
            return res.status(500).json({ message: 'Error verifying password', error: err.message });
        }
    })
}); 
app.post('/students',(req,res)=>{
    const { year, branch,section } = req.body;
    code=`${year}-${branch}-${section}`;
    //console.log(code);
    return res.status(200).json({data:"success post method"})
})
app.get('/students',(req,res)=>{
    
    const query = `SELECT id,name,section FROM \`${code}\``; 
    db.query(query,[code],(err,results)=>{
        if(err){
            console.log(err)
        }
        else{
            return res.status(200).json(results)
        }
    })
})
// Start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
