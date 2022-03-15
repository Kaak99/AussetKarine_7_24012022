// tests (à retirer)
console.log(` --------> auth`);
// pour checker l'authentfication de l'user à etre là
//montrer son token évite de relogin à chaque demande

const jwt = require('jsonwebtoken');
require('dotenv').config();
// const dotenv = require("dotenv");
// const result = dotenv.config();
//const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    // requete>headers>authorization contient : "Bearer chiffresdutoken" (ou parfois Bearer undefined quand pas de token, exemple=req login)
    //il faut splitter et prendre la donnée apres l'espace (pas 0 mais 1 donc)= chiffresdutoken :
    const token = req.headers.authorization.split(' ')[1];

    // ! on decode le token avec verify//
    // ! bonus : on stocke token decodé dans req pour y avoir acces + tard//
    req.token = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const userId = req.token.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};