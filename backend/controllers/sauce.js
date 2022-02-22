// tests (à retirer)
console.log(` --------> sauce-ctrl`);

const Sauce = require('../models/Sauce');
const fs = require('fs');//package fs de node


//!__         MODIFY SAUCE  (PUT+id sauce)                    __//
//!__ recoit : Sauce as JSON OR { sauce:String,image: File }  __//
//!__ renvoie : { message: String }                           __//

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



//!__        CREATE SAUCE (POST)              __//
//!__ recoit : { sauce: String, image: File } __//
//!__ renvoie : { message: String }           __//

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  console.log("userId de demande");
  console.log(sauceObject.userId);
  console.log("idToken");
  console.log(req.token.userId);
  
  const sauce = new Sauce({
    userId : sauceObject.userId,
    name : sauceObject.name,
    manufacturer : sauceObject.manufacturer,
    description : sauceObject.description,
    mainPepper : sauceObject.mainPepper,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    heat : sauceObject.heat,
    likes : 0,
    dislikes : 0,
    usersLiked : [],
    usersDisliked : []
  });
  console.log(sauce);
  if (sauce.userId === req.token.userId){
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json(error.message));
    //.catch(error => res.status(400).json({error}));
    //.catch(error => res.status(400).json(sauce));
  }
  else{
    res.status(403).json({ error: "userId usurpé : impossible de créer" });
  }
  
};


//!__     GET ONE SAUCE (GET+id sauce)      __//
//!__ recoit : -                            __//
//!__ renvoie : la sauce avec l’_id fourni  __//

exports.getOneSauce = (req, res, next) => {
  //Sauce.findOne({_id: req.params.id})
  console.log("Sauce choisie : "+req.params.id);
  Sauce.findById(req.params.id)
  .then((sauce) => { res.status(200).json(sauce)})
  .catch((error) => {res.status(404).json({error: error})});
};


//!__   DELETE SAUCE (DELETE+ id sauce)   __//
//!__ recoit : -                          __//
//!__ renvoie { message: String }         __//


exports.deleteSauce = (req, res, next) => {
  // console.log("idToken");
  // console.log(req.token.userId);
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId === req.token.userId){
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
      }
      else{
        res.status(403).json({message : "vous n'etes pas autorisé à effacer cette sauce"});//car la sauce d'un autre!
      }
    })
    .catch(error => res.status(500).json(error.message));
};




//!__          GET ALL SAUCE (GET)            __//
//!__ recoit : -                              __//
//!__ renvoie : tableau de toutes les sauces  __//

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauce) => { 
    res.status(200).json(sauce);
  })
  .catch((error) => {
    res.status(400).json({ error: error });
  });
};


//!__    LIKES&DISLIKES SAUCE (POST+id sauce)    __//
//!__ recoit : { userId: String, like: Number }  __//
//!__ renvoie : { message: String }              __//

exports.likeDislikeSauce = (req, res, next) => {
  //requete : userId(req.body.userId) et code like0/1/-1 (req.body.like)//
  //reponse attendue : message string//
  const likeChange = req.body.like;//le code 0/1/-1 renvoyé par le front
  const userId = req.body.userId;//le user qui veut liker/disliker
  const sauceId = req.params.id;  //la sauce d'ou part la requete
  console.log("--------------------------------");
  console.log(likeChange);
  console.log(userId);
  console.log(sauceId);
  console.log("--------------------------------");
  // 3 cas s'apres la doc api : 
  // sous entend que le front deja regardé si user avait liké disliké avant ou non
  // et la reponse 0 1 -1 est la synthése de toutes les possibilités
  try{
    //! cas 1 : userId a liké (et n'avait pas liké ou disliké avant)//
    if (likeChange=== 1) {
      Sauce.updateOne({_id: sauceId},{ $inc: {likes : +1}, $push: {usersLiked : userId}}) 
        .then( () => res.status(200).json({message : " sauce likée"}))
        .catch((error) => res.status(400).json({error}) )
    }

    //! cas 2 : userId a disliké (et n'avait pas liké ou disliké avant)//
    if (likeChange=== (-1)) {
      Sauce.updateOne({_id: sauceId},{ $inc: {dislikes : +1}, $push: {usersDisliked : userId}}) 
        .then( () => res.status(200).json({message : " sauce dislikée"}))
        .catch((error) => res.status(400).json({error}) )
    }

    //! cas 3 : userId avait liké ou disliké avant et vient d'annuler son like/dislike précedent//
    if (likeChange=== 0) {
      Sauce.findOne({_id: sauceId})
        .then( (sauce) => {
          if (sauce.usersLiked.includes(userId)) {//si son vote précédent == like
            Sauce.updateOne({_id: sauceId},{ $inc: {likes : -1}, $pull: {usersLiked : userId}}) 
        .then( () => res.status(200).json({message : "like retiré"}))//on le retire
        .catch((error) => res.status(400).json({error}) )
          }
          if (sauce.usersDisliked.includes(userId)) {//si son vote précédent == dislike
            Sauce.updateOne({_id: sauceId},{ $inc: {dislikes : -1}, $pull: {usersDisliked : userId}}) 
            .then( () => res.status(200).json({message : "dislike retiré"}))//on le retire
            .catch((error) => res.status(400).json({error}) )
          }
        })
    }

  }
  catch{error =>{
    console.log(req.body);
    console.log("probleme avec les like/dislike");
    res.status(500).json({error});
  }}

}; // fin du exports.likeDislikeSauce














//pour voir le contenu de la requete//
/*exports.xxxSauce = (req, res, next) => {
console.log(req.body);
res.status(201).json({message: 'from xxxSauce!'});}*/




/*note
  const thing = new Thing({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });

  =

    const thing = new Thing({
    ...req.body,
    _id: req.params.id
  });

*/