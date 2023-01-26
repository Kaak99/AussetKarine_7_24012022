// tests (à retirer)
console.log(` --------> checkPost`);
// pour checker la longueur des post (titre&contenu)

module.exports = (req, res, next) => {
  const regexTitre = /^.{2,50}$/;
  const regexContenu = /^.{2,500}$/;
  //console.log("req.body", req.body);
  if (regexTitre.test(req.body.titre)) {
    console.log("titre match");
    if (regexContenu.test(req.body.contenu)) {
      console.log("contenu match");
      next(); //ok si titre&contenu du post ok
    } else {
      console.log("contenu match pas");
      res.status(400).json({
        message: "contenu : 2 à 500 caractères",
      });
    }
  } else {
    //si email pas ok
    console.log("titre match pas");
    res.status(400).json({ message: "titre : 2 à 50 caractères" });
  }
};
