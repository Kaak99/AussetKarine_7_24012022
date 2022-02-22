// tests (à retirer)
console.log(` --------> app.js`);


const express = require('express');
//const helmet = require("helmet");//helmet pour protéger de différentes attaques
//const path = require('path');//pour acces au chemin des fichiers
const dotenv = require("dotenv").config();//import variables d'environnement
const mysql = require('mysql2');
//const morgan = require('morgan');//log requetes
const db = require('./db/db');

//const usersRoutes = require('./routes/users');//routes user
const postsRoutes = require('./routes/posts');//routes post (ex stuffRoutes)


// //bdd
// const db = mysql.createConnection({
//   host: 'localhost',
//   user : 'root',
//   password : process.env.DB_MDP,
//   database : process.env.DB_NAME
//   //database : `${process.env.DB_NAME}` 
// });





const app = express(); 

//app.use(helmet());//lance helmet


// db.query(
//   'SELECT * FROM groupomania.posts_table;',
//   function(err, results) {
//   console.log(results);
//   }
//   );



// db.query(
//   'SELECT * FROM groupomania.users_table;',
//   function(err, results) {
//   console.log(results);
//   }
//   );

// db.query(
// 'SELECT * FROM `posts_table` WHERE `userid` = 6',
// function(err, results) {
// console.log(results);
// }
// );

// -----------route générale : ---------------//

//MORGAN (module qui log req et res)
//app.use(morgan("dev"));

//CORS
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   next();
// });


// bodyparser //
//app.use(express.urlencoded({extended: true}));
//app.use(express.json());

// appel pour multer(chemin images) //
//app.use('/images' , express.static(path.join(__dirname, 'images')));
//app.use(express.static('images'));

// routes //
//app.use('/api/posts', postsRoutes);//(ex stuffRoutes)
//app.use('/api/users', usersRoutes);

module.exports = app;