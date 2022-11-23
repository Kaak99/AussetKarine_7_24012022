// tests (à retirer)
console.log(` --------> user-ctrl`);

//-----imports-----//

//const User = require('../models/User');//importe le modele
const bcrypt = require("bcrypt"); //(hash mdp)
const cryptojs = require("crypto-js"); //(chiffrage pour emails)
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config(); //import variables d'environnement

const db = require("../db/db");

//-----exports-----//

exports.getAllUsers = (req, res, next) => {
  //pour admin
  db.promise()
    .query("SELECT * FROM groupomania.users_table;")
    .then(([results]) => {
      //console.log(results);
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

exports.getOneUsers = (req, res, next) => {
  db.promise()
    .query(" SELECT * FROM groupomania.users_table WHERE `idUsers`=? ", [
      req.params.id,
    ])
    .then(([results]) => {
      //console.log(results);
      //console.log(results[0].pseudo);

      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
  //.then( () => db.end());
};

exports.modifyUser = (req, res, next) => {
  db.promise()
    .query(" SELECT * FROM groupomania.users_table WHERE `idUsers`=? ", [
      req.params.id,
    ])
    .then(([results]) => {
      // console.log("---req---");
      // console.log(req);
      console.log("---req.body---");
      console.log(req.body);
      // console.log("---results---");
      // console.log(results);
      // console.log("---results[0].image---");
      // console.log(results[0].image);

      const postObject = req.file
        ? {
            ...req.body,
            avatar: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
      //console.log(postObject);
      db.promise()
        .query(
          " UPDATE `groupomania`.`users_table` SET ?  WHERE `idUsers`=? ",
          [postObject, req.params.id]
        )
        .then(([results]) => {
          //console.log("---then1-modify---");
          res.status(200).json(results);
        })
        .catch((error) => {
          //console.log("---catch---");
          res.status(400).json({ error: error });
        });
    })
    .catch((error) => {
      //console.log("---catch---");
      res.status(400).json({ error: error });
    });
};

// exports.changeUserActivity = (req, res, next) => {
//   // let userTochangeActivity = { pseudo: req.body.pseudo, password: req.body.password, avatar: req.body.avatar, email: req.body.email, bio: req.body.bio, admin: req.body.admin, active: req.body.active };
//   // console.log(userTochangeActivity);
//   db.promise()
//     .query(
//       " UPDATE `groupomania`.`users_table` SET active=? WHERE `idUsers`=? ",
//       [req.body.active, req.params.id]
//     )
//     //db.promise().query(' UPDATE `groupomania`.`posts_table` SET ?  WHERE `idPosts`=? ', [changedPost, req.params.id])

//     .then(([results]) => {
//       //console.log(results);
//       res.status(200).json(results);
//     })
//     .catch((error) => {
//       res.status(400).json({ error: error });
//     });
// };

exports.deleteUsers = (req, res, next) => {
  //pour admin

  db.promise()
    .query(" SELECT * FROM groupomania.users_table WHERE `idUsers`=? ", [
      req.params.id,
    ])
    .then(([results]) => {
      //console.log("---then-find---");
      //console.log(req);
      //console.log(results);
      //console.log(results[0].image);
      if (results[0].image) {
        const filename = results[0].image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          db.promise()
            .query(" DELETE FROM groupomania.users_table WHERE `idUsers`=? ;", [
              req.params.id,
            ])
            .then(([results]) => {
              //console.log("---then1-efface---");

              res.status(200).json(results);
            })
            .catch((error) => {
              //console.log("---catch---");
              res.status(400).json({ error: error });
              //attention: ne dit rien si adresse d'une image inéxistante(efface post, 200)
            });
        });
      } else {
        db.promise()
          .query(" DELETE FROM groupomania.users_table WHERE `idUsers`=? ;", [
            req.params.id,
          ])
          .then(([results]) => {
            //console.log("---then2-efface---");

            res.status(200).json(results);
          })
          .catch((error) => {
            //console.log("---catch---");
            res.status(400).json({ error: error });
          });
      }
    });
};

// ! -------------------- ! //
// ! SIGNUP (inscription) ! //
// ! ---------------------! //
exports.signup = (req, res, next) => {
  console.log(" =============== début =============== ");
  //console.log(req);
  console.log("body=");
  console.log(req.body);
  console.log(req.body.pseudo);
  console.log(req.body.password);
  console.log(" =============== pause =============== ");
  let newUser;
  //pour createUser(=signUp), requete tout en formdata
  // avec pseudo/password/email/bio/active/admin/image
  // (ou rawjson possible si pas de file)
  if (!req.file) {
    console.log({ cas1noImag: req.body });
    newUser = {
      pseudo: req.body.pseudo,
      password: req.body.password,
      // avatar: req.body.avatar,
      avatar: "http://localhost:3000/images/default.jpg",
      email: req.body.email,
      bio: req.body.bio,
      admin: req.body.admin,
      active: req.body.active,
    };
  } else {
    console.log({ cas2Imag: req.body });
    newUser = {
      pseudo: req.body.pseudo,
      password: req.body.password,
      // avatar: req.body.avatar,
      avatar: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      email: req.body.email,
      bio: req.body.bio,
      admin: req.body.admin,
      active: req.body.active,
    };
  }
  //console.log(newUser);
  // let newUserCryptedEmail="";
  // let newUserHashedPassword="";

  //*si chiffrage mail!//
  newUser.email = cryptojs
    .HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL)
    .toString();
  //newUserHashedPassword=bcrypt.hash(req.body.password, 10);//marche pas (promise returned)
  //* hashage mdp ET sav dans bdd (non dissociable) //
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      newUser.password = hash;
      //console.log(newUser.password);
      console.log(newUser);

      // INSERT INTO `groupomania`.`users_table` (`pseudo`, `password`, `avatar`, `email`, `bio`, `admin`, `active`) VALUES ('u3', 'mdp', 'https://upload.wikimedia.org/wikipedia/commons/9/98/OOjs_UI_icon_userAvatar.svg', 'u3@mail.fr', 'inconnu!', '0', '1');
      db.promise()
        .query(" INSERT INTO `groupomania`.`users_table` SET ? ", newUser)
        .then(([results]) => {
          //console.log(results);
          console.log("utilisateur " + newUser.pseudo + " créé !");
          console.log(" =============== réponse:(et fin) =============== ");
          res.status(201).json(results);
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

// ! ------ ! //
// ! LOGIN  ! //
// ! ------ ! //
exports.login = (req, res, next) => {
  db.promise()
    .query(" SELECT * FROM groupomania.users_table WHERE `pseudo`=? ", [
      req.body.pseudo,
    ])
    // INSERT INTO `groupomania`.`users_table` (`pseudo`, `password`, `avatar`, `email`, `bio`, `admin`, `active`) VALUES ('u3', 'mdp', 'https://upload.wikimedia.org/wikipedia/commons/9/98/OOjs_UI_icon_userAvatar.svg', 'u3@mail.fr', 'inconnu!', '0', '1');
    //db.promise().query(' INSERT INTO `groupomania`.`users_table` SET ? ', newUser)

    .then(([results]) => {
      console.log({ results });
      console.log(req.body.pseudo);
      if (results.length === 0) {
        //if(!results)if(results==[])if(results===[])
        // = pas reconnu(passe dans else) et fini dans catch500(car utilise var inexistantes sans doute?)
        console.log("dans le if");
        console.log("utilisateur " + req.body.pseudo + " inconnu !");
        return res.status(401).json({ erreur: "utilisateur inconnu !" });
      } else {
        console.log("dans le else");
        //àvirerreturn res.status(400).json({ error: 'utilisateur inconnu !' });
        console.log(req.body.password);
        console.log(results[0].password);
        console.log(results[0].admin);
        bcrypt.compare(req.body.password, results[0].password).then((valid) => {
          if (!valid) {
            //si mdp pas valide
            console.log("Mot de passe incorrect !");
            return res.status(401).json({ erreur: "Mot de passe incorrect !" });
          } else {
            console.log("welcome back user " + results[0].pseudo + " !");
            res.status(200).json({
              admin: results[0].admin,
              userId: results[0].idUsers,
              token: jwt.sign(
                { userId: results[0].idUsers },
                process.env.JWT_SECRET_TOKEN,
                { expiresIn: "24h" }
                //token contenant userId+expiration est envoyé au front lors login (= le "payload")
                //token contiendra avec le payload(=info à transmettre) un header et une signature
                // (signature=issue de [header+payload], au moyen de clé privé JWT_SECRET_TOKEN )
                //ainsi toute modif de [header+payload] va changer la signature
                //(token controle 1/ l'authentification (remplace login/mdp) 2/son intégrité)
              ),
            });
          }
        });
      }
    })
    .catch((error) => {
      console.log("echec de la requête ");
      res.status(500).json({ error: error });
    });
};

//!__   get getAllLikes4OneUser (positif= à 1)(get + id user)   __//
//! router.get("/allLikes/:id", usersController.getAllLikes4OneUser);
//!__ recoit : -    (get)                         __//
//!__ renvoie tableau d'objet {"id_Posts": xxx} où like=1   __//

exports.getAllLikes4OneUser = (req, res, next) => {
  db.promise()
    .query(
      " SELECT id_Posts FROM groupomania.likes_table WHERE `id_Users`=? AND `like`=1 ;",
      [req.params.id]
    )
    // .query(
    //   " SELECT idPosts FROM groupomania.posts_table as p left join groupomania.likes_table as l on p.id_Users=l.id_Users WHERE `id_Users`=? AND `like`=1 ;",
    //   [req.params.id]
    // )
    // .query(
    //   "SELECT * FROM groupomania.likes_table as l left join groupomania.users_table as u on c.id_Users=u.idUsers WHERE `id_Posts`=? ORDER BY c.time DESC;",
    //   [req.params.id]
    // )
    .then(([results]) => {
      console.log(
        "nombre allLike for user " + req.params.id + "=" + results.length
      );
      res.status(200).json(results);
    })
    .catch((error) => {
      console.log("---catch(getAllLikes4OneUsers)---");
      res.status(400).json({ error: error });
    });
};

//!__   get getAllComments4OneUser (positif= à 1)(get + id user)   __//
//! router.get("/allComments/:id", usersController.getAllComments4OneUser);
//!__ recoit : -    (get)                         __//
//!__ renvoie tableau d'objet d'idpost{"id_Posts": xxx} des comments de l'user
//!__ attention doublon quand a commenté 2 fois le meme post     __//

exports.getAllComments4OneUser = (req, res, next) => {
  db.promise()
    .query(
      " SELECT id_Posts FROM groupomania.comments_table WHERE `id_Users`=?;",
      [req.params.id]
    )
    // .query(
    //   " SELECT idPosts FROM groupomania.posts_table as p left join groupomania.likes_table as l on p.id_Users=l.id_Users WHERE `id_Users`=? AND `like`=1 ;",
    //   [req.params.id]
    // )
    // .query(
    //   "SELECT * FROM groupomania.likes_table as l left join groupomania.users_table as u on c.id_Users=u.idUsers WHERE `id_Posts`=? ORDER BY c.time DESC;",
    //   [req.params.id]
    // )
    .then(([results]) => {
      console.log("allcomments for user " + req.params.id + "=");
      console.log(results);
      console.log(
        "nombre allcomments for user " + req.params.id + "=" + results.length
      );
      //on vire objets doublons dans le tableau
      results = Array.from(new Set(results.map(JSON.stringify))).map(
        JSON.parse
      );
      console.log("---puis sans doublon---");
      console.log("allcomments for user " + req.params.id + "=");
      console.log(results);
      console.log(
        "nombre allcomments for user " + req.params.id + "=" + results.length
      );
      res.status(200).json(results);
    })
    .catch((error) => {
      console.log("---catch(getAllComments4OneUser)---");
      res.status(400).json({ error: error });
    });
};

/* ---------------fin-----------------*/

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
