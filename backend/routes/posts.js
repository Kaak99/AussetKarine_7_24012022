// tests (à retirer)
console.log(` ----> posts-route`);

const express = require("express");
const router = express.Router();

// const auth = require('../middleware/auth');
const multer = require("../middleware/multer-config");
//multer necessaire si utilisation selecteur de fichier
const postsController = require("../controllers/posts");

router.get("/", postsController.getAllPosts);
router.post("/", multer, postsController.createPosts); //multer ici
router.get("/:id", postsController.getOnePosts);
router.put("/:id", multer, postsController.modifyPosts); //multer ici
router.delete("/:id", postsController.deletePosts);

/*
router.get('/', auth, postsController.getAllPosts);
router.post('/', auth, multer, postsController.createPosts);//multer ici
router.get('/:id', auth, postsController.getOnePosts);
router.put('/:id', auth, multer, postsController.modifyPosts);//multer ici
router.delete('/:id', auth, postsController.deletePosts);
*/

// router.posts('/:id/thumb', postsController.thumbPosts);

module.exports = router;
