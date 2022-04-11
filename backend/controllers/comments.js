// tests (à retirer)
console.log(` --------> comments-ctrl`);

//const Sauce = require('../models/Sauce');
const db = require('../db/db');
const fs = require('fs');//package fs de node



//!__   DELETE COMMENTS (DELETE+ id comment)   __//
//!__ recoit : -                          __//
//!__ renvoie { message: String }         __//


exports.deleteComments = (req, res, next) => {
      db.promise().query(' DELETE FROM groupomania.comments_table WHERE `idComments`=? ;', [req.params.id])
        .then( ([results]) => {
          console.log("deleting...");
          res.status(200).json(results);
        })
        .catch((error) => {
          console.log("---catch(deleteComments)---");
          res.status(400).json({ error: error });
    })}





//!__        CREATE COMMENTS (POST)              __//
//!__ recoit : as JSON OR { post: String, image: File } ?  __//
//!__ renvoie : { message: String }           __//


exports.createPosts = (req, res, next) => {
  //console.log(req);
  // console.log(req.body.titre);
  // console.log(req.body.contenu);
  // console.log(req.body.image);
  // console.log(req.body.id_Users);
    
  const postObject = JSON.parse(req.body.post);
  console.log("postObject");
  console.log(postObject);
  console.log("userId de demande");
  console.log(postObject.id_Users);
  let newPost ={};
  if(!postObject.image){//cas ou pas d'image
    newPost = { titre: postObject.titre, contenu: postObject.contenu, image: ``, id_Users: postObject.id_Users };
    console.log(newPost);

  }
  else{ //sinon (image présente)   
    newComment = { titre: postObject.titre, contenu: postObject.contenu, image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, id_Users: postObject.id_Users };
    console.log(newPost);
  }
  // db.promise().query(' INSERT INTO `groupomania`.`posts_table` (`titre`, `contenu`, `image`, `userid`) VALUES (req.body.titre, req.body.contenu, req.body.image, req.body.userid) ;')
   db.promise().query(' INSERT INTO `groupomania`.`posts_table` SET ? ', newPost) 

.then( ([results]) => {
  console.log(results);
  //console.log(req.body);
  console.log(req.body.post);
  console.log(JSON.parse(req.body.post));
  console.log(req.protocol);
  console.log(req.get('host'));
  console.log(req.file.filename);
  console.log(req.protocol +"://"+ req.get('host') +"/images/"+ req.file.filename);
  console.log(results.insertId);
  
  res.status(200).json(results);
})
.catch((error) => {
  res.status(400).json({ error: error });
  })
//.then( () => db.end());
};







//!__         MODIFY COMMENTS  (PUT+id post)                    __//
//!__ recoit : Post as raw-JSON(sans img) OR form-data { post:String,image: File }  __//
//!__ renvoie : { message: String }                           __//


exports.modifyPosts = (req, res, next) => {

  db.promise().query(' SELECT * FROM groupomania.posts_table WHERE `idPosts`=? ', [req.params.id])
  .then( ([results]) => {
    console.log("---then-find---");
    //console.log(req);     
    console.log(results);
    console.log(results[0].image);

   
      const postObject = req.file ? 
      {...JSON.parse(req.body.post),
      image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
      console.log(postObject);
      db.promise().query(' UPDATE `groupomania`.`posts_table` SET ?  WHERE `idPosts`=? ', [postObject, req.params.id])
        .then( ([results]) => {
            console.log("---then1-modify---");
            res.status(200).json(results);
          })
        .catch((error) => {
            console.log("---catch---");
            res.status(400).json({ error: error });
      })
  });
};

/*modify(sans fichier)--------------
exports.modifyPosts = (req, res, next) => {
  //console.log(req);
  // let changedPost = { titre: req.body.titre, contenu: req.body.contenu, image: req.body.image, userid:req.body.userid };
  let changedPost = { titre: req.body.titre, contenu: req.body.contenu, image: req.body.image};
  console.log(changedPost);
  // db.promise().query(' INSERT INTO `groupomania`.`posts_table` (`titre`, `contenu`, `image`, `userid`) VALUES (req.body.titre, req.body.contenu, req.body.image, req.body.userid) ;')
  //db.promise().query(' INSERT INTO `groupomania`.`posts_table` SET ? ', changedPost)
  //db.promise().query(' UPDATE `groupomania`.`posts_table` SET ? WHERE ', changedPost)
  // db.promise().query(' UPDATE `groupomania`.`posts_table` SET titre=?, contenu=?, image=? WHERE `idPosts`=? ', [req.body.titre, req.body.contenu,req.body.image, req.params.id])
  db.promise().query(' UPDATE `groupomania`.`posts_table` SET ?  WHERE `idPosts`=? ', [changedPost, req.params.id])
.then( ([results]) => {
  console.log(results);
  res.status(200).json(results);
})
.catch((error) => {
  res.status(400).json({ error: error });
  })
};
//-------------------------------------*/

/*
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
      const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    
    if (sauce.userId === req.token.userId){
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      //.catch(error => res.status(400).json({ error }));
      .catch(error => res.status(400).json(error.message));
    }
    else{
      res.status(403).json({message : "vous n'etes pas autorisé à modifier cette sauce"});//car la sauce d'un autre!
    }
  })  
  .catch(error => res.status(400).json(error.message));
}

*/



// //!__    LIKES&DISLIKES SAUCE (POST+id sauce)    __//
// //!__ recoit : { userId: String, like: Number }  __//
// //!__ renvoie : { message: String }              __//

// exports.likeDislikeSauce = (req, res, next) => {
//   //requete : userId(req.body.userId) et code like0/1/-1 (req.body.like)//
//   //reponse attendue : message string//
//   const likeChange = req.body.like;//le code 0/1/-1 renvoyé par le front
//   const userId = req.body.userId;//le user qui veut liker/disliker
//   const sauceId = req.params.id;  //la sauce d'ou part la requete
//   console.log("--------------------------------");
//   console.log(likeChange);
//   console.log(userId);
//   console.log(sauceId);
//   console.log("--------------------------------");
//   // 3 cas s'apres la doc api : 
//   // sous entend que le front deja regardé si user avait liké disliké avant ou non
//   // et la reponse 0 1 -1 est la synthése de toutes les possibilités
//   try{
//     //! cas 1 : userId a liké (et n'avait pas liké ou disliké avant)//
//     if (likeChange=== 1) {
//       Sauce.updateOne({_id: sauceId},{ $inc: {likes : +1}, $push: {usersLiked : userId}}) 
//         .then( () => res.status(200).json({message : " sauce likée"}))
//         .catch((error) => res.status(400).json({error}) )
//     }

//     //! cas 2 : userId a disliké (et n'avait pas liké ou disliké avant)//
//     if (likeChange=== (-1)) {
//       Sauce.updateOne({_id: sauceId},{ $inc: {dislikes : +1}, $push: {usersDisliked : userId}}) 
//         .then( () => res.status(200).json({message : " sauce dislikée"}))
//         .catch((error) => res.status(400).json({error}) )
//     }

//     //! cas 3 : userId avait liké ou disliké avant et vient d'annuler son like/dislike précedent//
//     if (likeChange=== 0) {
//       Sauce.findOne({_id: sauceId})
//         .then( (sauce) => {
//           if (sauce.usersLiked.includes(userId)) {//si son vote précédent == like
//             Sauce.updateOne({_id: sauceId},{ $inc: {likes : -1}, $pull: {usersLiked : userId}}) 
//         .then( () => res.status(200).json({message : "like retiré"}))//on le retire
//         .catch((error) => res.status(400).json({error}) )
//           }
//           if (sauce.usersDisliked.includes(userId)) {//si son vote précédent == dislike
//             Sauce.updateOne({_id: sauceId},{ $inc: {dislikes : -1}, $pull: {usersDisliked : userId}}) 
//             .then( () => res.status(200).json({message : "dislike retiré"}))//on le retire
//             .catch((error) => res.status(400).json({error}) )
//           }
//         })
//     }

//   }
//   catch{error =>{
//     console.log(req.body);
//     console.log("probleme avec les like/dislike");
//     res.status(500).json({error});
//   }}

// }; // fin du exports.likeDislikeSauce














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

// */