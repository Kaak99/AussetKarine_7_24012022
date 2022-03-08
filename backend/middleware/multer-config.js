// tests (à retirer)
console.log(` --------> multerconfig`);
// multer pour la manipulation des fichiers

const multer = require('multer');

//on limite les fichiers accessibles (sécurité, contre les exe)
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//multer config=const storage=1/destination fichier(dossier images)2/filename
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//export(1:const storage 2:fichiers image uniquement)
module.exports = multer({storage: storage}).single('image');