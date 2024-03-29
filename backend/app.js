// tests (à retirer)
console.log(` --------> app.js`);

const express = require("express");
//const helmet = require("helmet");//helmet pour protéger de différentes attaques
const path = require("path"); //pour acces au chemin des fichiers
const dotenv = require("dotenv").config(); //import variables d'environnement
const mysql = require("mysql2");
const morgan = require("morgan"); //log requetes
const db = require("./db/db");

const usersRoutes = require("./routes/users"); //routes users
const postsRoutes = require("./routes/posts"); //routes post (ex stuffRoutes)
const commentsRoutes = require("./routes/comments"); //routes commentaires
const likesRoutes = require("./routes/likes"); //routes likes

const app = express();
//app.use(helmet());//lance helmet

// -----------route générale : ---------------//

//MORGAN (module qui log req et res)
app.use(morgan("dev"));

//CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  //console.log("req.body", req);
  next();
});

// bodyparser //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// appel pour multer(chemin images) //
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static("images"));

// routes //
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);

module.exports = app;
