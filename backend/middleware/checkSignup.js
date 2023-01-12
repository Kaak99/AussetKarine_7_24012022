// tests (à retirer)
console.log(` --------> checksignUp`);
// pour checker la solidité du mot de passe
// (et checker l'entrée mail)

module.exports = (req, res, next) => {
  // const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regexEmail = /^\w+([\.-]?\w+)*@gpm.fr$/;
  const regexPseudo = /\w{2,25}$/;
  const regexBio = /\w{0,200}$/;
  //const regexAvatar = /\w{0,25}$/;
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  console.log("req.body", req.body);
  if (regexEmail.test(req.body.email)) {
    if (regexPassword.test(req.body.password)) {
      console.log("email match et password aussi");
      next(); //ok si password&email ok
    } else {
      //si password pas ok
      console.log("email match mais pas password");
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
