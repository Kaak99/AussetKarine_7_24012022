// tests (à retirer)
console.log(` --------> posts-ctrl`);

const db = require("../db/db");
const fs = require("fs"); //package fs de node

//!__          GET ALL POSTS (GET)            __//
//!__ recoit : -                              __//
//!__ renvoie : tableau de toutes les posts  __//

exports.getAllPosts = (req, res, next) => {
  db.promise()
    .query(
      "SELECT p.idPosts, p.titre, p.contenu, p.image, p.time, p.nombreComment, p.nombreLike, p.id_Users, u.pseudo, u.avatar, u.admin FROM groupomania.posts_table as p left join groupomania.users_table as u on p.id_Users=u.idUsers ORDER BY p.time DESC;"
    )
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

//!__     GET ONE POSTS (GET+id posts)      __//
//!__ recoit : -                            __//
//!__ renvoie : le posts avec l’_id fourni  __//

exports.getOnePosts = (req, res, next) => {
  db.promise()
    .query(" SELECT * FROM groupomania.posts_table WHERE `idPosts`=? ", [
      req.params.id,
    ])
    .then(([results]) => {
      res.status(200).json(results[0]);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

/* pour ne plus sortir un tableau
db.promise().query(' SELECT * FROM groupomania.posts_table WHERE `idPosts`=? ', [req.params.id])
.then( (results) => {
  console.log(results[0][0].idPosts);
  res.status(200).json(results[0][0]);
*/

//!__   DELETE POSTS (DELETE+ id post)   __//
//!__ recoit : -                          __//
//! router.delete('/:id', postsController.deletePosts) //
//!__ renvoie { message: String }         __//

exports.deletePosts = async (req, res, next) => {
  try {
    const [RES_InfoPostADelete] = await db
      .promise()
      .query(" SELECT * FROM groupomania.posts_table WHERE `idPosts`=? ", [
        req.params.id,
      ]);
    const idDuPost = req.params.id; //id du post à delete
    const useridDuCreateurDuPost = RES_InfoPostADelete[0].id_Users; //createur du post à delete
    const useridDuDemandeur = req.token.userId; //Demandeur de requete delete

    const [RES_adminStatusDuDemandeur] = await db
      .promise()
      .query("SELECT admin FROM groupomania.users_table WHERE `idUsers`=? ", [
        useridDuDemandeur,
      ]);
    const adminStatusDuDemandeur = RES_adminStatusDuDemandeur[0].admin;
    // console.log("adminStatusDuDemandeur", adminStatusDuDemandeur);
    //on vérifie légitimité du demandeur
    if (
      useridDuCreateurDuPost === useridDuDemandeur ||
      adminStatusDuDemandeur === 1
    ) {
      console.log("admis");
      //cas 1 = avec une image (il va falloir supprimer ce fichier image du serveur)
      if (RES_InfoPostADelete[0].image) {
        const filename = RES_InfoPostADelete[0].image.split("/images/")[1];
        fs.unlink(`images/${filename}`, async () => {
          const [RES_DeletePostAvecImage] = await db
            .promise()
            .query(" DELETE FROM groupomania.posts_table WHERE `idPosts`=?;", [
              idDuPost,
            ]);
          console.log("delete post avec image");
          res.status(200).json(RES_DeletePostAvecImage);
        });
        //cas 2 = pas d' image
      } else {
        const [RES_DeletePostSansImage] = await db
          .promise()
          .query(" DELETE FROM groupomania.posts_table WHERE `idPosts`=? ;", [
            idDuPost,
          ]);
        console.log("delete post sans image");
        res.status(200).json(RES_DeletePostSansImage);
      }
    } else {
      console.log("pas admis");
      res.status(401).json({
        error: "! pas autorisé (vous n'etes pas l'auteur ni admin) !",
      });
    }
  } catch (error) {
    console.log("probleme lors delete du message");
    res.status(400).json({ error: error });
  }
};
//attention: ne dit rien si adresse d'une image inéxistante(efface post, 200)

//!__        CREATE POSTS (POST)              __//
//!__ recoit : as JSON OR { post: String, image: File } ?  __//
//!__ renvoie : { message: String }           __//

exports.createPosts = (req, res, next) => {
  const postObject = req.body;
  //console.log("postObject",postObject);
  let newPost = {};
  //console.log({ monImage: req.file.originalname });
  //console.log(req.file);
  if (!req.file) {
    //cas ou pas d'image
    newPost = {
      titre: postObject.titre,
      contenu: postObject.contenu,
      image: "",
      id_Users: postObject.id_Users,
    };
    //si pas d'image, rawjson(ou formdata3/3) avec titre/contenu/id_Users
  } else {
    //sinon (image présente)
    //alors req= formdata(4/4) avec titre/contenu/id_Users/image
    newPost = {
      titre: postObject.titre,
      contenu: postObject.contenu,
      image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      id_Users: postObject.id_Users,
    };
  }
  // db.promise().query(' INSERT INTO `groupomania`.`posts_table` (`titre`, `contenu`, `image`, `userid`) VALUES (req.body.titre, req.body.contenu, req.body.image, req.body.userid) ;')
  db.promise()
    .query(" INSERT INTO `groupomania`.`posts_table` SET ? ", newPost)

    .then(([results]) => {
      // console.log(req.body.post);
      // console.log(JSON.parse(req.body.post));
      // console.log(
      //   req.protocol + "://" + req.get("host") + "/images/" + req.file.filename
      // );
      // console.log(results.insertId);

      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

//!__         MODIFY POSTS  (PUT+id post)                    __//
//!__ recoit : Post as raw-JSON(sans img) OR form-data { post:String,image: File }  __//
//!__ renvoie : { message: String }                           __//

exports.modifyPosts = async (req, res, next) => {
  try {
    const [RES_InfoPostAModifier] = await db
      .promise()
      .query(" SELECT * FROM groupomania.posts_table WHERE `idPosts`=? ", [
        req.params.id,
      ]);
    const idDuPost = req.params.id; //id du post à modifier
    const useridDuCreateurDuPost = RES_InfoPostAModifier[0].id_Users; //createur du post à modifier
    const useridDuDemandeur = req.token.userId; //Demandeur de requete modifier
    // console.log("idDuPost", idDuPost);
    // console.log("useridDuCreateurDuPost.body", useridDuCreateurDuPost);
    // console.log("useridDuDemandeur", useridDuDemandeur);

    const [RES_adminStatusDemandeur] = await db
      .promise()
      .query("SELECT admin FROM groupomania.users_table WHERE `idUsers`=? ", [
        useridDuDemandeur,
      ]);
    const adminStatusDuDemandeur = RES_adminStatusDemandeur[0].admin;
    // console.log("adminStatusDuDemandeur", adminStatusDuDemandeur);

    if (
      useridDuCreateurDuPost === useridDuDemandeur ||
      adminStatusDuDemandeur === 1
    ) {
      console.log(
        "admis (demandeur est soit le createur du post, soit un admin)"
      );
      let oldfilename = "rien";
      if (RES_InfoPostAModifier[0].image) {
        oldfilename = RES_InfoPostAModifier[0].image.split("/images/")[1];
        // console.log("oldfilename=", oldfilename);
      }
      //maintenant filename contient le nom du fichier initial de l'image (ou "rien" si pas d'image")
      let postObject = {};
      //cas1: un fichier image a été envoyé
      if (req.file) {
        console.log("cas1:fichier image reçu");
        postObject = {
          ...req.body,
          image: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        };
        // console.log("postObject", postObject);
        //console.log("fichier de l'image précédente à effacer");
        if (oldfilename !== "rien") {
          fs.unlink(`images/${oldfilename}`, (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log("ancienne image effacée");
            }
          });
        }
      } else if (req.body.noImg === "") {
        console.log("cas2: zero image"); //on n'a pas envoyé d'image mais en + on veut supprimer l'ancienne
        postObject = {
          titre: req.body.titre,
          contenu: req.body.contenu,
          id_Users: req.body.id_Users,
          image: req.body.noImg,
        };
        //console.log("postObject", postObject);
        //console.log("fichier de l'image précédente à effacer");
        if (oldfilename !== "rien") {
          //console.log("oldfilename", oldfilename);
          fs.unlink(`images/${oldfilename}`, (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log("ancienne image effacée");
            }
          });
        }
      } else {
        console.log("cas3:juste texte modifié");
        // postObject = { ...req.body };
        postObject = {
          titre: req.body.titre,
          contenu: req.body.contenu,
          id_Users: req.body.id_Users,
        };
        //console.log("postObject", postObject);
      }
      delete postObject.id_Users;
      //on ne veut pas inscrire id_users car si moderation, on veut garder nom auteur post, pas l'écraser par celui du moderateur
      //console.log(postObject);
      const RES_updatePost = await db
        .promise()
        .query(
          " UPDATE `groupomania`.`posts_table` SET ?  WHERE `idPosts`=? ",
          [postObject, req.params.id]
        );
      console.log("on a modifié le post");
      res.status(200).json(RES_updatePost);
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
