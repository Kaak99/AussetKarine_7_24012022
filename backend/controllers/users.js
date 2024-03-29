// tests (à retirer)
console.log(` --------> user-ctrl`);

//-----imports-----//

const fs = require("fs"); //package fs de node(fichiers)
const bcrypt = require("bcrypt"); //(hash mdp)
//const cryptojs = require("crypto-js"); //(chiffrage pour emails)
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config(); //import variables d'environnement

const db = require("../db/db");

//-----exports-----//

// ! --------- getAllUsers ----------- ! //
exports.getAllUsers = (req, res, next) => {
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

// ! --------- getOneUsers ----------- ! //
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

// ! --------- modifyUser ----------- ! //

exports.modifyUser = async (req, res, next) => {
  try {
    const [RES_InfoUserAModifier] = await db
      .promise()
      .query(" SELECT * FROM groupomania.users_table WHERE `idUsers`=? ", [
        req.params.id,
      ]);
    const idUser = req.params.id; //id du user à delete
    const useridDuDemandeur = req.token.userId; //Demandeur de requete modifier
    // console.log("idUser", idUser);
    // console.log("typeof idUser", typeof idUser);
    // console.log("useridDuDemandeur", useridDuDemandeur);
    // console.log("typeof useridDuDemandeur", typeof useridDuDemandeur);
    const [RES_adminStatusDemandeur] = await db
      .promise()
      .query("SELECT admin FROM groupomania.users_table WHERE `idUsers`=? ", [
        useridDuDemandeur,
      ]);
    const adminStatusDuDemandeur = RES_adminStatusDemandeur[0].admin;
    // console.log("adminStatusDuDemandeur", adminStatusDuDemandeur);

    if (idUser == useridDuDemandeur || adminStatusDuDemandeur === 1) {
      console.log(
        "admis (demandeur est soit le createur du post, soit un admin)"
      );

      const bddAvatarUserAModifier = RES_InfoUserAModifier[0].avatar;
      // console.log("avatar ds bdd", bddAvatarUserAModifier);
      let oldfilename = "rien";
      if (bddAvatarUserAModifier) {
        oldfilename = bddAvatarUserAModifier.split("/images/")[1];
        // console.log("oldfilename=", oldfilename);
      }
      //maintenant filename contient le nom du fichier de l'avatar ou "rien" s'il n'y en avait pas pas

      //on definit postObject(nouveau profil à envoyer à bdd)
      let postObject = {};

      if (req.file) {
        console.log("cas1=user a changé son avatar (+/-texte)");
        // console.log("new avatar path(dsrequete):", req.file.path);
        // console.log("new avatar(dsrequete):", req.file.filename);
        postObject = {
          ...req.body,
          avatar: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        };
        // console.log("postObject(cas1)", postObject);

        if (oldfilename === "rien" || oldfilename === "default.gif") {
          console.log("pas de fichier à effacer");
        } else {
          console.log("fichier de l'avatar précédent à effacer");
          fs.unlink(`images/${oldfilename}`, (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log("old avatar effacé");
            }
          });
        }
      } else {
        console.log("cas2=user n'a changé que du texte");
        postObject = { ...req.body };
        console.log("postObject(cas2)", postObject);
      }

      //console.log("postObject",postObject);
      const RES_updateUser = await db
        .promise()
        .query(
          " UPDATE `groupomania`.`users_table` SET ?  WHERE `idUsers`=? ",
          [postObject, idUser]
        );
      console.log("on a modifié user" + idUser);
      res.status(200).json(RES_updateUser);
    } else {
      console.log("pas admis");
      res.status(401).json({
        error: "! pas autorisé (vous n'etes pas l'auteur ni admin) !",
      });
    }
  } catch (error) {
    console.log("probleme lors modif du commentaire");
    res.status(400).json({ error: error });
  }
};

// ! --------- deleteUsers ----------- ! //

exports.deleteUsers = async (req, res, next) => {
  try {
    const [RES_InfoUserADelete] = await db
      .promise()
      .query(" SELECT * FROM groupomania.users_table WHERE `idUsers`=? ;", [
        req.params.id,
      ]);
    const idUser = req.params.id; //id du user à delete
    const useridDuDemandeur = req.token.userId; //Demandeur de requete modifier
    const [RES_adminStatusDuDemandeur] = await db
      .promise()
      .query("SELECT admin FROM groupomania.users_table WHERE `idUsers`=? ", [
        useridDuDemandeur,
      ]);
    const adminStatusDuDemandeur = RES_adminStatusDuDemandeur[0].admin;
    console.log("adminStatusDuDemandeur", adminStatusDuDemandeur);
    //on vérifie légitimité du demandeur
    if (idUser == useridDuDemandeur || adminStatusDuDemandeur === 1) {
      console.log("admis");

      //on met ds un tableau les id de ts les like=1 de ce user
      //on met ds un tableau les id de ts les comment de ce user
      // ------- comment -------
      const [RES_idPostCommentedBy1User] = await db
        .promise()
        .query(
          " SELECT id_Posts FROM groupomania.comments_table WHERE `id_Users`=? ;",
          [idUser]
        );
      console.log("RES_idPostCommentedBy1User", RES_idPostCommentedBy1User);
      // ------- like -------
      //recuperons l'idpost des post likés par ce users
      const [RES_idPostLikedBy1User] = await db
        .promise()
        .query(
          " SELECT id_Posts FROM groupomania.likes_table WHERE `id_Users`=? AND `like`=1 ;",
          [idUser]
        );
      console.log("RES_idPostLikedBy1User", RES_idPostLikedBy1User);
      // -- endlike/comment : on attendra delete de user pour faire les comptes/sommes pour ces post et updater bdd------

      let filename = "rien";
      if (RES_InfoUserADelete[0].avatar) {
        const bddAvatarUserADelete = RES_InfoUserADelete[0].avatar;
        console.log("avatar ds bdd=", bddAvatarUserADelete);
        filename = bddAvatarUserADelete.split("/images/")[1];
        console.log("filename=", filename);
      }
      //maintenant filename contient le nom du fichier de l'avatar ou "rien" s'il n'y en a pas
      if (filename === "rien" || filename === "default.gif") {
        const [RES_deleteUser_sansAvatar] = await db
          .promise()
          .query("DELETE FROM groupomania.users_table WHERE `idUsers`=? ;", [
            idUser,
          ]);
        console.log("on a bien supprimé juste user" + idUser);

        //on a delete le user (dans le cas de user sans avatar)
        //maintenant on va refaire compte des likes et com apres delete (juste pour idPosts concernés)
        // --- cas des comments--
        for (
          let index = 0;
          index < RES_idPostCommentedBy1User.length;
          index++
        ) {
          let idPostI = RES_idPostCommentedBy1User[index].id_Posts;
          //dabord on fait la somme des likes pour chaque post
          let [comptageDesCommentsPourChaquePost] = await db
            .promise()
            .query(
              " SELECT count(c.idComments) as nbComment from groupomania.comments_table as c WHERE id_Posts=?;",
              [idPostI]
            );
          let nbCommentPourChaquePostI =
            comptageDesCommentsPourChaquePost[0].nbComment;
          //ensuite on update bdd avec ce comptage pour chaque post
          let [RES_updateNbComment] = await db
            .promise()
            .query(
              " UPDATE groupomania.posts_table SET nombreComment=?  WHERE idPosts=? ",
              [nbCommentPourChaquePostI, idPostI]
            );
        }
        // --- cas des likes--
        for (let index = 0; index < RES_idPostLikedBy1User.length; index++) {
          let idPostI = RES_idPostLikedBy1User[index].id_Posts;
          //dabord on fait la somme des likes pour chaque post
          let [additionDesLikesPourChaquePost] = await db
            .promise()
            .query(
              " select sum(l.like) as nbLike from groupomania.likes_table as l WHERE id_Posts=?;",
              [idPostI]
            );
          let nbLikePourChaquePostI = additionDesLikesPourChaquePost[0].nbLike;
          //ensuite on update bdd avec cette somme pour chaque post
          let [RES_updateSumLike] = await db
            .promise()
            .query(
              " UPDATE groupomania.posts_table SET nombreLike=? WHERE `idPosts`=? ",
              [nbLikePourChaquePostI, idPostI]
            );
        }
        // ---fin mise à jour compte like/comment apres delete d'un user (cas sans image)
        res.status(200).json(RES_deleteUser_sansAvatar);
      } else {
        //s'il y a bien un fichier pour l'avatar et que ce n'est pas default.gif, alors on supprime le fichier (+le user)
        fs.unlink(`images/${filename}`, async () => {
          const [RES_deleteUser_etAvatar] = await db
            .promise()
            .query("DELETE FROM groupomania.users_table WHERE `idUsers`=? ;", [
              idUser,
            ]);
          console.log(
            "on a bien supprimé user" + idUser + " ET fichier avatar"
          );
          //on a delete le user (dans le cas de user sans avatar)
          //maintenant on va refaire compte des likes et com apres delete (juste pour idPosts concernés)
          // --- cas des comments--
          for (
            let index = 0;
            index < RES_idPostCommentedBy1User.length;
            index++
          ) {
            let idPostI = RES_idPostCommentedBy1User[index].id_Posts;
            //dabord on fait la somme des likes pour chaque post
            let [comptageDesCommentsPourChaquePost] = await db
              .promise()
              .query(
                " SELECT count(c.idComments) as nbComment from groupomania.comments_table as c WHERE id_Posts=?;",
                [idPostI]
              );
            let nbCommentPourChaquePostI =
              comptageDesCommentsPourChaquePost[0].nbComment;
            //ensuite on update bdd avec ce comptage pour chaque post
            let [RES_updateNbComment] = await db
              .promise()
              .query(
                " UPDATE groupomania.posts_table SET nombreComment=?  WHERE idPosts=? ",
                [nbCommentPourChaquePostI, idPostI]
              );
          }
          // --- cas des likes--
          for (let index = 0; index < RES_idPostLikedBy1User.length; index++) {
            let idPostI = RES_idPostLikedBy1User[index].id_Posts;
            //dabord on fait la somme des likes pour chaque post
            let [additionDesLikesPourChaquePost] = await db
              .promise()
              .query(
                " select sum(l.like) as nbLike from groupomania.likes_table as l WHERE id_Posts=?;",
                [idPostI]
              );
            let nbLikePourChaquePostI =
              additionDesLikesPourChaquePost[0].nbLike;
            //ensuite on update bdd avec cette somme pour chaque post
            let [RES_updateSumLike] = await db
              .promise()
              .query(
                " UPDATE groupomania.posts_table SET nombreLike=? WHERE `idPosts`=? ",
                [nbLikePourChaquePostI, idPostI]
              );
          }
          // ---fin mise à jour compte like/comment apres delete d'un user (cas sans image)
          res.status(200).json(RES_deleteUser_etAvatar);
          //attention: ne dit rien si adresse d'une image inexistante, changer? par :
          //fs.unlink("example_file.txt", (err => {
          //   if (err) console.log(err);
          //   else {}
        });
      }
    } else {
      console.log("pas admis");
      res.status(401).json({
        error: "! pas autorisé (vous n'etes pas cette personne ni l'admin) !",
      });
    }
  } catch (error) {
    console.log("probleme lors delete user");
    res.status(400).json({ error: error });
  }
};

// ! -------------------- ! //
// ! SIGNUP (inscription) ! //
// ! ---------------------! //
exports.signup = (req, res, next) => {
  // console.log("body=",req.body);
  // console.log(req.body.pseudo);
  // console.log(req.body.password);
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
      avatar: "http://localhost:3000/images/default.gif",
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
      // bio: req.body.bio,
      admin: req.body.admin,
      active: req.body.active,
    };
  }
  //console.log(newUser);
  // let newUserCryptedEmail="";
  // let newUserHashedPassword="";

  //*si chiffrage mail!//
  // newUser.email = cryptojs
  //   .HmacSHA256(req.body.email, process.env.CRYPTOJS_EMAIL)
  //   .toString();
  //newUserHashedPassword=bcrypt.hash(req.body.password, 10);//marche pas (promise returned)

  //* hashage mdp ET sav dans bdd (non dissociable) //
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      newUser.password = hash;
      //console.log(newUser.password);
      console.log(newUser);
      db.promise()
        .query(" INSERT INTO `groupomania`.`users_table` SET ? ", newUser)
        .then(([results]) => {
          //console.log(results);
          console.log("utilisateur " + newUser.pseudo + " créé !");
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
    .then(([results]) => {
      // console.log({ results });
      // console.log(req.body.pseudo);
      if (results.length === 0) {
        console.log("utilisateur " + req.body.pseudo + " inconnu !");
        return res.status(401).json({ erreur: "utilisateur inconnu !" });
      } else {
        // console.log(req.body.password);
        // console.log(results[0].password);
        // console.log(results[0].admin);
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

/* ---recuperer pour un user tous les likes & comments---*/

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
    .then(([results]) => {
      console.log(
        "nombre allLike for user " + req.params.id + "=" + results.length
      );
      res.status(200).json(results);
    })
    .catch((error) => {
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
    .then(([results]) => {
      console.log("allcomments for user " + req.params.id + "=", results);
      console.log(
        "nombre allcomments for user " + req.params.id + "=" + results.length
      );
      //on vire objets doublons dans le tableau
      results = Array.from(new Set(results.map(JSON.stringify))).map(
        JSON.parse
      );
      console.log("---puis sans doublon---");
      console.log("allcomments for user " + req.params.id + "=", results);
      console.log(
        "nombre allcomments for user " + req.params.id + "=" + results.length
      );
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

/* ---------------fin-----------------*/

/* --- user: changer droits/actif (non implémenté) ---*/

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
