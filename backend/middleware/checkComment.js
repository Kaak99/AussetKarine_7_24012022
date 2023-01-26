// tests (à retirer)
console.log(` --------> checkComment`);
// pour checker la longueur des commentaires (contenu)

module.exports = (req, res, next) => {
  const regexContenu = /^.{1,256}$/;
  //console.log("req.body", req.body);
  if (regexContenu.test(req.body.contenu)) {
    console.log("contenu match");
    next(); //ok si contenu du comment est ok
  } else {
    console.log("contenu match pas");
    res.status(400).json({
      message: "doit contenir 1 à 256 caractères",
    });
  }
};
