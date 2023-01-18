// tests (à retirer)
console.log(` --------> checkComment`);
// pour checker la longueur des commentaires (contenu)

module.exports = (req, res, next) => {
  const regexContenu = /^.{2,256}$/;
  //console.log("req.body", req.body);
  if (regexContenu.test(req.body.contenu)) {
    console.log("contenu match");
  } else {
    console.log("contenu match pas");
    res.status(400).json({
      message: "contenu : 2 à 256 caractères",
    });
  }
};
