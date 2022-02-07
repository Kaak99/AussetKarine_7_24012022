// tests (à retirer)
console.log(` --------> app.js`);


const express = require('express');
//const helmet = require("helmet");//helmet pour protéger de différentes attaques
//const path = require('path');//pour acces au chemin des fichiers
const dotenv = require("dotenv").config();//import variables d'environnement
const mysql = require('mysql2');
//const morgan = require('morgan');//log requetes

// const userRoutes = require('./routes/user');//routes user
// const sauceRoutes = require('./routes/sauce');//routes sauce (ex stuffRoutes)


//bdd
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
  console.log('connected to mysql foodly');
});



const app = express(); 

//app.use(helmet());//lance helmet

db.query(
  'SELECT `marque`,`nom` FROM aliment;',
  function(err, results) {
  console.log(results);
  }
  );

db.query(
'SELECT * FROM `aliment` WHERE `marque` = "monoprix" AND `id` > 1',
function(err, results) {
console.log(results);
}
);
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
//app.use('/api/sauces', sauceRoutes);//(ex stuffRoutes)
//app.use('/api/auth', userRoutes);

module.exports = app;