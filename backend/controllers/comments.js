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
      res.status(400).json({ error: error });
    });
};

//!__   get all COMMENTS from ONE POST(get + id du post)   __//
//!__ recoit : -                             __//
//!__ renvoie tableau de toutes les comments __//

exports.getAllComments4OnePost = (req, res, next) => {
  db.promise()
    .query(
      "SELECT * FROM groupomania.comments_table as c left join groupomania.users_table as u on c.id_Users=u.idUsers WHERE `id_Posts`=? ORDER BY c.time DESC;",
      [req.params.id]
    )
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((error) => {
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
    .query(
      "SELECT COUNT(*) FROM groupomania.comments_table WHERE `id_Posts`=?;",
      [req.params.id]
    )
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

//!__   DELETE COMMENTS (DELETE+ id comment)   __//
//!__ recoit : -                          __//
//!__ renvoie { message: String }         __//

exports.deleteComments = async (req, res, next) => {
  try {
    const [RES_InfoComADelete] = await db
      .promise()
      .query(
        " SELECT * FROM groupomania.comments_table WHERE `idComments`=? ;",
        [req.params.id]
      );
    const idDuCom = req.params.id; //id du com à delete
    const idDuPost = req.params.idpost; //id du post parent de ce com à delete
    const useridDuCreateurDuCom = RES_InfoComADelete[0].id_Users; //createur du com à delete
    const useridDuDemandeur = req.token.userId; //Demandeur de requete delete
    // console.log("idDuCom", idDuCom);
    // console.log("idDuPost", idDuPost);
    // console.log("useridDuCreateurDuCom", useridDuCreateurDuCom);
    // console.log("useridDuDemandeur", useridDuDemandeur);
    const [RES_adminStatusDuDemandeur] = await db
      .promise()
      .query("SELECT admin FROM groupomania.users_table WHERE `idUsers`=? ", [
        useridDuDemandeur,
      ]);
    const adminStatusDuDemandeur = RES_adminStatusDuDemandeur[0].admin;
    // console.log("adminStatusDuDemandeur", adminStatusDuDemandeur);
    //on vérifie légitimité du demandeur
    if (
      useridDuCreateurDuCom === useridDuDemandeur ||
      adminStatusDuDemandeur === 1
    ) {
      console.log("admis");
      await db
        .promise()
        .query(
          "DELETE FROM groupomania.comments_table WHERE `idComments`=? ;",
          [idDuCom]
        );
      console.log("on a bien supprimé le commentaire");
      //il reste à mettre à jour le nombreComment dans tablePosts
      //console.log(idDuPost);
      const [RES_nbCommentPourCePost] = await db
        .promise()
        .query(
          " SELECT count(c.idComments) as nbComment from groupomania.comments_table as c WHERE id_Posts=? ;",
          [idDuPost]
        );
      const nbCommentPourCePost = RES_nbCommentPourCePost[0].nbComment;
      console.log(
        "nombre de com(nbComment) pour ce post:",
        nbCommentPourCePost
      );
      const [RES_DeleteComment] = await db
        .promise()
        .query(
          " UPDATE `groupomania`.`posts_table` SET `nombreComment`=?  WHERE `idPosts`=? ",
          [nbCommentPourCePost, idDuPost]
        );
      console.log("on a bien ajusté le nombreComment dans tablePosts");
      res.status(200).json(RES_DeleteComment);
    } else {
      console.log("pas admis");
      res.status(401).json({
        error: "! pas autorisé (vous n'etes pas l'auteur ni admin) !",
      });
    }
  } catch (error) {
    console.log("probleme lors delete du commentaire");
    res.status(400).json({ error: error });
  }
};

//!__        CREATE COMMENTS (POST)              __//
//!__ recoit : as raw JSON                      __//
//!__ renvoie : { message: String }           __//

exports.createComments = (req, res, next) => {
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
      db.promise()
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

exports.modifyComments = async (req, res, next) => {
  try {
    const [RES_InfoComAModifier] = await db
      .promise()
      .query(
        " SELECT * FROM `groupomania`.`comments_table` WHERE `idComments`=? ;",
        [req.params.id]
      );
    const idDuCom = req.params.id; //id du com à modif
    const useridDuCreateurDuCom = RES_InfoComAModifier[0].id_Users; //createur du com à modifier
    const useridDuDemandeur = req.token.userId; //Demandeur de requete modifier
    // console.log("idDuCom", idDuCom);
    // console.log("useridDuCreateurDuCom", useridDuCreateurDuCom);
    // console.log("useridDuDemandeur", useridDuDemandeur);
    const [RES_adminStatusDuDemandeur] = await db
      .promise()
      .query("SELECT admin FROM groupomania.users_table WHERE `idUsers`=? ", [
        useridDuDemandeur,
      ]);
    const adminStatusDuDemandeur = RES_adminStatusDuDemandeur[0].admin;
    // console.log("adminStatusDuDemandeur", adminStatusDuDemandeur);
    //on vérifie légitimité du demandeur
    if (
      useridDuCreateurDuCom === useridDuDemandeur ||
      adminStatusDuDemandeur === 1
    ) {
      console.log("admis");
      const [RES_updateDuCom] = await db
        .promise()
        .query(
          " UPDATE `groupomania`.`comments_table` SET `contenu`=?  WHERE `idComments`=? ",
          [req.body.contenu, req.params.id]
        );
      console.log("on a bien modifié le commentaire");
      res.status(200).json(RES_updateDuCom);
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
