// tests (à retirer)
console.log(` --------> checksignUp`);
// pour checker la solidité du mot de passe
// (et checker l'entrée mail)

module.exports = (req, res, next) => {
  // const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regexEmail = /^\w+([\.-]?\w+)*@gpm.fr$/;
  const regexPseudo = /^\w{2,25}$/;
  const regexBio = /^.{0,200}$/;
  //const regexAvatar = /\w{0,25}$/;
  const regexPassword =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-z^A-Z^0-9]).{8,}$/;
  console.log("req.body", req.body);
  if (regexEmail.test(req.body.email)) {
    console.log("email match");
    if (regexPassword.test(req.body.password)) {
      console.log("password match");
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
          message:
            "pseudo invalide (2 à 25 caracteres=lettres,chiffre,underscore)",
        });
      }
    } else {
      console.log("password match pas");
      res.status(400).json({
        message:
          "mot de passe insuffisant (au moins 8 caracteres, dont un chiffre/minuscule/majuscule/caracSpeciaux",
      });
    }
  } else {
    //si email pas ok
    console.log("email match pas");
    res.status(400).json({ message: "pas un email valide" });
  }
};
