// tests (à retirer)
console.log(` --------> thumbs-ctrl`);

//const Sauce = require('../models/Sauce');
const db = require('../db/db');
const fs = require('fs');//package fs de node




//!__       MODIFY COMMENTS  (PUT+id comment)          __//
//!__ recoit : raw-JSON                               __//
//!__ renvoie : { message: String }                  __//


exports.modifyThumbs = (req, res, next) => {
  //console.log(req);
  console.log(req.body);

  //on a juste besoin de changer en +1 ou -1 (ou zéro) 
  db.promise().query(' UPDATE `groupomania`.`thumbs_table` SET updown=?  WHERE `idThumbs`=? ', [req.body.updown, req.params.id])
    .then( ([results]) => {
        console.log("modifying...");
        res.status(200).json(results);
      })
    .catch((error) => {
        console.log("catch (modify)");
        res.status(400).json({ error: error });
  })
};

