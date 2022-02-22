console.log(` -----> db.js`);

const mysql = require('mysql2');
require('dotenv').config();

// Connexion bdd

const db = mysql.createConnection({
  host: 'localhost',
  user : 'root',
  password : process.env.DB_MDP,
  database : process.env.DB_NAME
  //database : `${process.env.DB_NAME}` 
});

db.connect( err => {
  if (err) {
    throw err;
  }
  console.log('connected to mysql groupomania');
});

module.exports = db;