// tests (à retirer)
console.log(` --------> comments-ctrl`);

//const Sauce = require('../models/Sauce');
const db = require("../db/db");
const fs = require("fs"); //package fs de node

//!__   get all COMMENTS (get)               __//
//!__ recoit : -                             __//
//!__ renvoie tableau de toutes les comments __//

exports.getAllComments = (req, res, next) => {
  db.promise()
    .query(" SELECT * FROM groupomania.comments_table ")
    .then(([results]) => {
      //console.log("affiche...");
      res.status(200).json(results);
    })
    .catch((error) => {
      //console.log("---catch(getAllComments)---");
      res.status(400).json({ error: error });
    });
};

//!__   get all COMMENTS from ONE POST(get + id du post)   __//
//!__ recoit : -                             __//
//!__ renvoie tableau de toutes les comments __//

exports.getAllComments4OnePost = (req, res, next) => {
  db.promise()
    // .query(
    //   " SELECT * FROM groupomania.comments_table  WHERE `id_Posts`=?  ORDER BY time DESC;",
    //   [req.params.id]
    // )
    .query(
      "SELECT * FROM groupomania.comments_table as c left join groupomania.users_table as u on c.id_Users=u.idUsers WHERE `id_Posts`=? ORDER BY c.time DESC;",
      [req.params.id]
    )
    .then(([results]) => {
      //console.log("affiche...");
      res.status(200).json(results);
    })
    .catch((error) => {
      //console.log("---catch(getAllComments4OnePost)---");
      res.status(400).json({ error: error });
    });
};
//table-com(c) est left-jointe à table-user(u) sur le critere des userId de chaque table
//on prends tous(*) les com pour l'id post donné /:id (et on classe par ordre decroissant)

//!__   get COMMENT'S number for ONE POST(GET +id du post) __//
//!__ recoit : -                             __//
//!__ renvoie tableau de toutes les comments __//

exports.getCommentsNumber4OnePost = (req, res, next) => {
  db.promise()
    // .query(
    //   " SELECT * FROM groupomania.comments_table  WHERE `id_Posts`=?  ORDER BY time DESC;",
    //   [req.params.id]
    // )
    .query(
      "SELECT COUNT(*) FROM groupomania.comments_table WHERE `id_Posts`=?;",
      [req.params.id]
    )
    .then(([results]) => {
      //console.log("affiche...");
      res.status(200).json(results);
    })
    .catch((error) => {
      //console.log("---catch(getAllComments4OnePost)---");
      res.status(400).json({ error: error });
    });
};

//!__   DELETE COMMENTS (DELETE+ id comment)   __//
//!__ recoit : -                          __//
//!__ renvoie { message: String }         __//

exports.deleteComments = (req, res, next) => {
  db.promise()
    .query(" DELETE FROM groupomania.comments_table WHERE `idComments`=? ;", [
      req.params.id,
    ])
    .then(([results]) => {
      console.log("on a bien supprimé le commentaire");
      //res.status(200).json(results);(=non, il faut le donner à la fin de tous les then)
      //il reste à mettre à jour le nombreComment dans tablePosts
      db.promise()
        //on compte combien il y a de commentaires(idComments)
        .query(
          " SELECT count(c.idComments) as nbComment from groupomania.comments_table as c WHERE id_Posts=?;",
          [idPosts]
        )
        .then(([results]) => {
          console.log(
            "on compte le nombre de com(nbComment) pour ce post dans bdd"
          );
          console.log(results[0].nbComment);
          db.promise()
            .query(
              " UPDATE `groupomania`.`posts_table` SET `nombreComment`=?  WHERE `idPosts`=? ",
              [results[0].nbComment, idPosts]
            )
            .then(([results]) => {
              console.log("on a bien ajusté le nombreComment dans tablePosts");
              res.status(200).json(results);
            })
            .catch((error) => {
              console.log("erreur update nombreComment");
              res.status(400).json({ error: error });
            });
        })
        .catch((error) => {
          console.log("erreur dans compte de nbComment");
          res.status(400).json({ error: error });
        });
    })
    .catch((error) => {
      console.log("probleme lors suppression du commentaire");
      res.status(400).json({ error: error });
    });
};

//!__        CREATE COMMENTS (POST)              __//
//!__ recoit : as raw JSON                      __//
//!__ renvoie : { message: String }           __//

exports.createComments = (req, res, next) => {
  //console.log(req);
  //console.log(req.body.contenu);
  //console.log(req.body.id_Posts);
  //console.log(req.body.id_Users);

  // const commentObject = JSON.parse(req.body.post);
  // console.log("commentObject");
  // console.log(commentObject);
  // console.log("userId de demande");
  // console.log(commentObject.id_Users);
  // console.log("Id du post commenté");
  // console.log(commentObject.id_Posts);
  let newComment = {
    contenu: req.body.contenu,
    id_Posts: req.body.id_Posts,
    id_Users: req.body.id_Users,
  };
  let idPosts = req.body.id_Posts;
  //console.log(newComment);

  // db.promise().query(' INSERT INTO `groupomania`.`posts_table` (`titre`, `contenu`, `image`, `userid`) VALUES (req.body.titre, req.body.contenu, req.body.image, req.body.userid) ;')
  db.promise()
    .query(" INSERT INTO `groupomania`.`comments_table` SET ? ", newComment)

    .then(([results]) => {
      //console.log(results);
      //mettre à jour le nombreComment
      console.log(idPosts);
      db.promise()
        //on compte combien il y a de commentaires(idComments)
        .query(
          " SELECT count(c.idComments) as nbComment from groupomania.comments_table as c WHERE id_Posts=?;",
          [idPosts]
        )
        .then(([results]) => {
          console.log(
            "on compte le nombre de com(nbComment) pour ce post dans bdd"
          );
          console.log(results[0].nbComment);
          db.promise()
            .query(
              " UPDATE `groupomania`.`posts_table` SET `nombreComment`=?  WHERE `idPosts`=? ",
              [results[0].nbComment, idPosts]
            )
            .then(([results]) => {
              console.log("on a bien ajusté le nombreComment dans tablePosts");
              res.status(200).json(results);
            })
            .catch((error) => {
              console.log("erreur update nombreComment");
              res.status(400).json({ error: error });
            });
        })
        .catch((error) => {
          console.log("erreur dans compte de nbComment");
          res.status(400).json({ error: error });
        });
    })
    .catch((error) => {
      console.log("erreur création commentaire");
      res.status(400).json({ error: error });
    });
};

//!__       MODIFY COMMENTS  (PUT+id comment)          __//
//!__ recoit : raw-JSON                               __//
//!__ renvoie : { message: String }                  __//

exports.modifyComments = (req, res, next) => {
  //console.log(req);
  //console.log(req.body);
  //db.promise().query(' SELECT * FROM groupomania.comments_table WHERE `idComments`=? ', [req.params.id])
  //const commentsObject = { contenu: req.body.contenu, id_Posts: req.body.id_Posts, id_Users: req.body.id_Users };
  //console.log(commentsObject);
  //db.promise().query(' UPDATE `groupomania`.`comments_table` SET ?  WHERE `idComments`=? ', [commentsObject, req.params.id])

  //fonctionne (mais juste contenu à changer donc inutile)//
  //db.promise().query(' UPDATE `groupomania`.`comments_table` SET contenu=?,id_Posts=?,id_Users=?  WHERE `idComments`=? ', [req.body.contenu, req.body.id_Posts, req.body.id_Users, req.params.id])

  //on a juste besoin de changer le contenu
  db.promise()
    .query(
      " UPDATE `groupomania`.`comments_table` SET `contenu`=?  WHERE `idComments`=? ",
      [req.body.contenu, req.params.id]
    )
    .then(([results]) => {
      //console.log("---modifing...---");
      res.status(200).json(results);
    })
    .catch((error) => {
      //console.log("---catch (modify)---");
      res.status(400).json({ error: error });
    });
};

/*fonctionne (mais juste contenu à changer donc inutile)-----------------------------
  db.promise().query(' UPDATE `groupomania`.`comments_table` SET contenu=?,id_Posts=?,id_Users=?  WHERE `idComments`=? ', [req.body.contenu, req.body.id_Posts, req.body.id_Users, req.params.id])
//-------------------------------------*/

// //pour voir le contenu de la requete//
// /*exports.xxxSauce = (req, res, next) => {
// console.log(req.body);
// res.status(201).json({message: 'from xxxSauce!'});}*/

// /*note
//   const thing = new Thing({
//     _id: req.params.id,
//     title: req.body.title,
//     description: req.body.description,
//     imageUrl: req.body.imageUrl,
//     price: req.body.price,
//     userId: req.body.userId
//   });

//   =

//     const thing = new Thing({
//     ...req.body,
//     _id: req.params.id
//   });
//
