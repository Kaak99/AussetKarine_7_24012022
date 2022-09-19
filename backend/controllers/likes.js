// tests (à retirer)
console.log(` --------> likes-ctrl`);

//const Sauce = require('../models/Sauce');
const db = require("../db/db");
const fs = require("fs"); //package fs de node

//!__   get LIKE'S number for ONE POST(GET +id du like) __//
//!__ recoit : -                             __//
//!__ renvoie tableau de toutes les comments __//
// Faux! compte le nombre d'entrée dans la bdd! donc compte les likes à zero comme à 1 !
exports.getLikesNumber4OnePost = (req, res, next) => {
  db.promise()
    // .query(
    //   " SELECT * FROM groupomania.comments_table  WHERE `id_Posts`=?  ORDER BY time DESC;",
    //   [req.params.id]
    // )
    .query("SELECT COUNT(*) FROM groupomania.likes_table WHERE `id_Posts`=?;", [
      req.params.id,
    ])
    .then(([results]) => {
      console.log("affiche...");
      res.status(200).json(results);
    })
    .catch((error) => {
      console.log("---catch(getLikesNumber4OnePost)---");
      res.status(400).json({ error: error });
    });
};

//!__   get all LIKES (positif= à 1) from ONE POST(get + id du post)   __//
//!__ recoit : -                             __//
//!__ renvoie tableau d'objets tq {"idLikes": xx,"like": 1,"id_Users": xx,"id_Posts": xx }, __//

exports.getAllLikes4OnePost = (req, res, next) => {
  db.promise()
    .query(
      " SELECT * FROM groupomania.likes_table  WHERE `id_Posts`=? AND `like`=1 ;",
      [req.params.id]
    )
    // .query(
    //   "SELECT * FROM groupomania.likes_table as l left join groupomania.users_table as u on c.id_Users=u.idUsers WHERE `id_Posts`=? ORDER BY c.time DESC;",
    //   [req.params.id]
    // )
    .then(([results]) => {
      console.log("like=" + results.length);
      res.status(200).json(results);
    })
    .catch((error) => {
      console.log("---catch(getAllComments4OnePost)---");
      res.status(400).json({ error: error });
    });
};

//!__       CREATE LIKEs  (POST+id likes)                     __//
//!__ recoit : raw-JSON {"like":1,"id_Posts":x,"id_Users":x}  __//
//!__ renvoie : { message: String }                           __//

// exports.createLikes = (req, res, next) => {
//   //console.log(req);
//   console.log("createLike!");
//   console.log(req.body);
//   let newLike = {
//     like: req.body.like, //sera forcément 0 ou 1 (tester!!)
//     id_Posts: req.body.id_Posts,
//     id_Users: req.body.id_Users,
//   };
//   db.promise()
//     .query(" INSERT INTO `groupomania`.`likes_table` SET ? ", newLike)

//     .then(([results]) => {
//       console.log(results);
//       res.status(200).json(results);
//     })
//     .catch((error) => {
//       res.status(400).json({ error: error });
//     });
// };

//!__   MODIFY LIKEs  (PUT+id likes= NON) (POST) (permet creer+modifier)   __//
//!__ recoit : raw-JSON                               __//
//!__ renvoie : { message: String }                  __//

//essai de tout faire sur modify : creer et modifier
//car le front envoi juste un id user et idpost et un like à zero ou 1 sans faire la requet voir si champ like existe deja quand on clic sur coeur
//il faut que le back regarde si champ existe et recup idlike et mette à jour la valeur
//si n'existe pas, cree la donnée
//tout faire en mode post du coté de la requete front/postman?? (pas de put, il faut choisir)
//autre solution : à chaque nouveau user ou nouveau post, la base sql cree un champ like à valeur à zero par defaut (e tdans ce cas là, juste un put necessaire; mais va gonfler++ la bdd inutilement pour des likes qui ne seraient jamais créés sans ça)

exports.modifyLikes = (req, res, next) => {
  //console.log(req);
  //console.log("modifyLike!");
  //console.log(req.body);
  db.promise()
    .query(
      " SELECT * FROM groupomania.likes_table WHERE `id_Users`=? AND `id_Posts`=?",
      [req.body.id_Users, req.body.id_Posts]
    )
    .then(([results]) => {
      //console.log(req);
      //console.log(results);
      let likeId; //id du like, à trouver dans bdd (si existe déjà) grace à id_user/post fourni dans req
      let likeUpdate = req.body.like; //la valeur qu'on veut donner au like d'apres req
      if (results.length === 0) {
        //si aucun resultat, alors on va creer ce champ like (verifier avant que user et post id existant bien?de toute facon erreur sinon->catch du create)
        console.log("pas de resultats, on crée!");
        // CREATION du champ like
        let newLike = {
          like: likeUpdate, //sera forcément 0 ou 1 (tester!!)
          id_Posts: req.body.id_Posts,
          id_Users: req.body.id_Users,
        };
        db.promise()
          .query(" INSERT INTO `groupomania`.`likes_table` SET ? ", newLike)

          .then(([results]) => {
            console.log("on crée le like");
            res.status(200).json(results);
          })
          .catch((error) => {
            console.log("probleme pour crer le like");
            res.status(400).json({ error: error });
          });
      } else {
        console.log(results);
        //si ce champ like existe, alors on recup l'idLikes et on peut update notre like
        likeId = results[0].idLikes; //il ne doit en trouver qu'un mais ma requete renvoie toujours un tableau d'ou le [0] pour prendrer le 1er
        console.log("l'id du like est :");
        console.log(likeId);
        console.log("la nouvelle valeur du like est :");
        console.log(likeUpdate);
        //MODIFICATION de notre champ like
        db.promise()
          .query(
            " UPDATE `groupomania`.`likes_table` SET `like`=?  WHERE `idLikes`=? ",
            [likeUpdate, likeId]
          )
          .then(([results]) => {
            console.log("---like updated---");
            res.status(200).json(results);
          })
          .catch((error) => {
            console.log("--- echec likeUpdate (catch du modify)---");
            console.log(typeof likeId);
            console.log(typeof likeUpdate);
            res.status(400).json({ error: error });
          });
      }
    })
    .catch((error) => {
      console.log("---catch---");
      res.status(400).json({ error: error });
    });

  // let newLike = {
  //   like: req.body.like, //sera forcément 0 ou 1 (tester!!)
  //   id_Posts: req.body.id_Posts,
  //   id_Users: req.body.id_Users,
  // };
  // db.promise()
  //   .query(" INSERT INTO `groupomania`.`likes_table` SET ? ", newLike)

  //   .then(([results]) => {
  //     console.log(results);
  //     res.status(200).json(results);
  //   })
  //   .catch((error) => {
  //     res.status(400).json({ error: error });
  //   });
};

// exports.modifyLikes = (req, res, next) => {
//   //console.log(req);
//   console.log(req.body);

//   //on a juste besoin de changer en +1 ou -1 (ou zéro)
//   db.promise()
//     .query(
//       " UPDATE `groupomania`.`thumbs_table` SET updown=?  WHERE `idLikes`=? ",
//       [req.body.updown, req.params.id]
//     )
//     .then(([results]) => {
//       console.log("modifying...");
//       res.status(200).json(results);
//     })
//     .catch((error) => {
//       console.log("catch (modify)");
//       res.status(400).json({ error: error });
//     });
// };