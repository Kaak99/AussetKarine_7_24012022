// tests (à retirer)
console.log(` --------> checkModifyUser`);
// pour checker la solidité du mot de passe
// (et checker l'entrée mail)

module.exports = (req, res, next) => {
  const regexPseudo = /^\w{2,25}$/;
  const regexBio = /^.{0,200}$/;
  //console.log("req.body", req.body);
  if (regexPseudo.test(req.body.pseudo)) {
    console.log("pseudo match");
    if (regexBio.test(req.body.bio)) {
      console.log("bio match");
      next(); //ok si password&email ok
    } else {
      console.log("bio match pas");
      res.status(400).json({ message: "bio trop longue(>200)" });
    }
  } else {
    console.log("pseudo match pas");
    res.status(400).json({
      message: "pseudo invalide (2 à 25 caracteres=lettres,chiffre,underscore)",
    });
  }
};
