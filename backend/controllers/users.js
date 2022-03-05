// tests (à retirer)
console.log(` --------> user-ctrl`);

//-----imports-----//

//const User = require('../models/User');//importe le modele
const bcrypt = require('bcrypt');//(hash mdp)
const cryptojs = require('crypto-js');//(chiffrage pour emails)
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();//import variables d'environnement

const db = require('../db/db');


//-----exports-----//


exports.getAllUsers = (req, res, next) => {//pour admin
  db.promise().query('SELECT * FROM groupomania.users_table;')
  .then( ([results]) => {
    console.log(results);
    res.status(200).json(results);
  })
  .catch((error) => {
    res.status(400).json(error);
    })
  //.then( () => db.end());

};


exports.changeUserActivity = (req, res, next) => {
  // let userTochangeActivity = { pseudo: req.body.pseudo, password: req.body.password, avatar: req.body.avatar, email: req.body.email, bio: req.body.bio, admin: req.body.admin, active: req.body.active };
  // console.log(userTochangeActivity);
  db.promise().query(' UPDATE `groupomania`.`users_table` SET active=? WHERE `idUsers`=? ', [req.body.active, req.params.id])
  //db.promise().query(' UPDATE `groupomania`.`posts_table` SET ?  WHERE `idPosts`=? ', [changedPost, req.params.id])

.then( ([results]) => {
  console.log(results);
  res.status(200).json(results);
})
.catch((error) => {
  res.status(400).json({ error: error });
  })
};


exports.signup = (req, res, next) => {
  console.log(req.body.pseudo);
  console.log(req.body.password);
  let newUser = { pseudo: req.body.pseudo, password: req.body.password, avatar: req.body.avatar, email: req.body.email, bio: req.body.bio, admin: req.body.admin, active: req.body.active };
  console.log(newUser);

  // INSERT INTO `groupomania`.`users_table` (`pseudo`, `password`, `avatar`, `email`, `bio`, `admin`, `active`) VALUES ('u3', 'mdp', 'https://upload.wikimedia.org/wikipedia/commons/9/98/OOjs_UI_icon_userAvatar.svg', 'u3@mail.fr', 'inconnu!', '0', '1');
  db.promise().query(' INSERT INTO `groupomania`.`users_table` SET ? ', newUser)



  .then( ([results]) => {
    console.log(results);
    res.status(200).json(results);
  })
  .catch((error) => {
    res.status(400).json({ error: error });
    })
}




/*

//! 1.signup : on va enregistrer l'utilisateur dans la bdd
//--------------------------------------------------------//
exports.signup = (req, res, next) => {
  
  // ! chiffrage email ! //
  const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL).toString();//si chiffrage mail!
  //console.log(process.env.CRYPTOJS_EMAIL);
  // ! hashage mdp ! //
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: emailCryptoJs,//si chiffrage mail!
        //email: req.body.email,//si pas de chiffrage mail!
        password: hash
      });



      console.log(req.body.pseudo);
      console.log(req.body.password);
      let newUser = { pseudo: req.body.pseudo, password: req.body.password, avatar: req.body.avatar, email: req.body.email, bio: req.body.bio, admin: req.body.admin, active: req.body.active };
      console.log(newUser);
    
      // INSERT INTO `groupomania`.`users_table` (`pseudo`, `password`, `avatar`, `email`, `bio`, `admin`, `active`) VALUES ('u3', 'mdp', 'https://upload.wikimedia.org/wikipedia/commons/9/98/OOjs_UI_icon_userAvatar.svg', 'u3@mail.fr', 'inconnu!', '0', '1');
      db.promise().query(' INSERT INTO `groupomania`.`users_table` SET ? ', newUser)
    
    .then( ([results]) => {
      console.log(results);
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
      })







    })
    .catch(error => res.status(500).json({ error }));
};


//! 2.login :
//---------//
exports.login = (req, res, next) => {
  // ! chiffrage email ! //
  const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL).toString();//si chiffrage mail!
  //console.log(emailCryptoJs);
  // ! chercher si email existe dans bdd ! //
  User.findOne({email:emailCryptoJs})//si chiffrage mail!
  //User.findOne({ email: req.body.email })//si pas de chiffrage mail!
    .then(user => {
      if (!user) {//si pas trouvé
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // ! si trouvé //
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {//si mdp pas valide
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // ! si mdp valide //
          console.log("welcome back user "+user._id+" !");
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_TOKEN,
              { expiresIn: '24h' }
              //token contenant userId+expiration est envoyé au front lors login (= le "payload")
              //token contiendra avec le payload(=info à transmettre) un header et une signature
              // (signature=issue de [header+payload], au moyen de clé privé JWT_SECRET_TOKEN )
              //ainsi toute modif de [header+payload] va changer la signature
              //(token controle 1/ l'authentification (remplace login/mdp) 2/son intégrité)
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};



*/




// //! 1.signup : on va enregistrer l'utilisateur dans la bdd
// //--------------------------------------------------------//
// exports.signup = (req, res, next) => {
//   // ! chiffrage email ! //
//   const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL).toString();//si chiffrage mail!
//   //console.log(process.env.CRYPTOJS_EMAIL);
//   // ! hashage mdp ! //
//   bcrypt.hash(req.body.password, 10)
//     .then(hash => {
//       const user = new User({
//         email: emailCryptoJs,//si chiffrage mail!
//         //email: req.body.email,//si pas de chiffrage mail!
//         password: hash
//       });
//       user.save()
//         .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
//         .catch(error => res.status(400).json({ error }));
//     })
//     .catch(error => res.status(500).json({ error }));
// };


// //! 2.login :
// //---------//
// exports.login = (req, res, next) => {
//   // ! chiffrage email ! //
//   const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL).toString();//si chiffrage mail!
//   //console.log(emailCryptoJs);
//   // ! chercher si email existe dans bdd ! //
//   User.findOne({email:emailCryptoJs})//si chiffrage mail!
//   //User.findOne({ email: req.body.email })//si pas de chiffrage mail!
//     .then(user => {
//       if (!user) {//si pas trouvé
//         return res.status(401).json({ error: 'Utilisateur non trouvé !' });
//       }
//       // ! si trouvé //
//       bcrypt.compare(req.body.password, user.password)
//         .then(valid => {
//           if (!valid) {//si mdp pas valide
//             return res.status(401).json({ error: 'Mot de passe incorrect !' });
//           }
//           // ! si mdp valide //
//           console.log("welcome back user "+user._id+" !");
//           res.status(200).json({
//             userId: user._id,
//             token: jwt.sign(
//               { userId: user._id },
//               process.env.JWT_SECRET_TOKEN,
//               { expiresIn: '24h' }
//               //token contenant userId+expiration est envoyé au front lors login (= le "payload")
//               //token contiendra avec le payload(=info à transmettre) un header et une signature
//               // (signature=issue de [header+payload], au moyen de clé privé JWT_SECRET_TOKEN )
//               //ainsi toute modif de [header+payload] va changer la signature
//               //(token controle 1/ l'authentification (remplace login/mdp) 2/son intégrité)
//             )
//           });
//         })
//         .catch(error => res.status(500).json({ error }));
//     })
//     .catch(error => res.status(500).json({ error }));
// };