// tests (à retirer)
console.log(` --------> likes-ctrl`);

const db = require("../db/db");
const fs = require("fs"); //package fs de node

//!__   CREATE&MODIFY LIKEs  (PUT+id likes= NON) (POST) (permet creer+modifier)   __//
//!__ recoit : raw-JSON                               __//
//!__ renvoie : { message: String }                  __//

//ici on va creer ET modifier
//car le front envoi juste un id user et idpost et un like à zero ou 1 sans faire la requete voir si champ like existe deja quand on clic sur coeur
//il faut que le back regarde si champ existe et recup idlike et mette à jour la valeur
//si n'existe pas, cree la donnée

exports.modifyLikes = async (req, res, next) => {
  try {
    const [results1] = await db
      .promise()
      .query(
        " SELECT * FROM groupomania.likes_table WHERE `id_Users`=? AND `id_Posts`=?",
        [req.body.id_Users, req.body.id_Posts]
      );
    let likeId; //id du like, à trouver dans bdd (si existe déjà) grace à id_user/post fourni dans req
    let likeUpdate = req.body.like; //la valeur qu'on veut donner au like d'apres req
    let idPosts = req.body.id_Posts;
    if (likeUpdate < 0 || likeUpdate > 1) throw error;
    if (results1.length === 0) {
      console.log("pas de resultats, on crée!");
      // CREATION du champ like
      let newLike = {
        like: likeUpdate, //sera forcément 0 ou 1 (vérifié ligne27)
        id_Posts: req.body.id_Posts,
        id_Users: req.body.id_Users,
      };
      await db
        .promise()
        .query(" INSERT INTO `groupomania`.`likes_table` SET ? ", newLike);
      console.log("on crée le like");
    } else {
      console.log(results1);
      //si ce champ like existe, alors on recup l'idLikes et on peut update notre like
      likeId = results1[0].idLikes;
      // console.log("l'id du like est : ",likeId);
      // console.log("la nouvelle valeur du like est :",likeUpdate);
      //MODIFICATION de notre champ like
      await db
        .promise()
        .query(
          " UPDATE `groupomania`.`likes_table` SET `like`=?  WHERE `idLikes`=? ",
          [likeUpdate, likeId]
        );
      console.log(" on a bien update le like ");
    }
    const [results2] = await db
      .promise()
      .query(
        " select sum(l.like) as nbLike from groupomania.likes_table as l WHERE id_Posts=?;",
        [idPosts]
      );
    // console.log("on a fait la somme du nombre des likes",results2[0].nbLike);
    const [results3] = await db
      .promise()
      .query(
        " UPDATE `groupomania`.`posts_table` SET `nombreLike`=?  WHERE `idPosts`=? ",
        [results2[0].nbLike, idPosts]
      );
    //console.log("on a (créé/modifié puis) update nombreLike (postsTable)");
    res.status(200).json(results3);
  } catch (error) {
    console.log("probleme pour crer le like");
    res.status(400).json({ error: error });
  }
};

//!__   get LIKE'S number for ONE POST(GET /count/:id du post) __//
//!__ recoit : -                             __//
//!__ renvoie la somme des likes pour un post  __//

exports.getLikesNumber4OnePost = (req, res, next) => {
  db.promise()
    // .query("SELECT COUNT(*) FROM groupomania.likes_table WHERE `id_Posts`=?;", [
    //   req.params.id,
    // ])
    // non : compte le nombre d'entrée/d'élement dans la table des like (qu'ils soient à zero ou 1)
    .query(
      "SELECT SUM(groupomania.likes_table.like) FROM groupomania.likes_table WHERE `id_Posts`=?;",
      [req.params.id]
    )
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

//!__   get CountperPost :idpost et combien like (tableau d'bjet)
//! ( GET /count ) __//
//!__ recoit : -                             __//
//!__ renvoie un tableau avec l id du post et le nombre de like pour ce post  __//

exports.getCountperPost = (req, res, next) => {
  db.promise()
    .query(
      "SELECT groupomania.likes_table.id_Posts, SUM(groupomania.likes_table.like) FROM groupomania.likes_table;"
    )
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((error) => {
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
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};
